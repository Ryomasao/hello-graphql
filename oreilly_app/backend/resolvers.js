const path = require('path')
const { GraphQLScalarType } = require("graphql");
const { authorizeWithGithub, getFakeUsers, uploadStream } = require("./lib");

const users = [
  { githubLogin: "u1", name: "user1" },
  { githubLogin: "u2", name: "user2" },
  { githubLogin: "u3", name: "user3" },
];

const photos = [
  {
    id: 100,
    name: "p1",
    description: "this is p1",
    category: "SELFIE",
    githubUser: "u1",
    created: "2021/01/01",
  },
  {
    id: 101,
    name: "p2",
    description: "this is p2",
    category: "PORTRAIT",
    githubUser: "u2",
    created: "2021/01/02",
  },
  {
    id: 102,
    name: "p3",
    description: "this is p3",
    category: "PORTRAIT",
    githubUser: "u2",
    created: "2021/01/03",
  },
];

const tags = [
  { photoId: 100, userId: "u1" },
  { photoId: 101, userId: "u1" },
  { photoId: 102, userId: "u2" },
];

module.exports = resolvers = {
  Query: {
    totalPhotos: (parent, args, { db }) => {
      return db.collection("photos").estimatedDocumentCount();
    },
    allPhotos: (parent, args, { db }) =>
      db.collection("photos").find().toArray(),
    totalUsers: (parent, args, { db }) =>
      db.collection("users").estimatedDocumentCount(),
    allUsers: (parent, args, { db }) => db.collection("users").find().toArray(),
    me: (parent, args, { currentUser }) => currentUser,
  },
  Mutation: {
    // Mutationのresolverの第1引数って親への参照になるんだっけ？
    async postPhoto(parent, args, context) {
      if (!context.currentUser) {
        throw new Error("Unauthorized");
      }

      const newPhoto = {
        ...args.input,
        userId: context.currentUser.githubLogin,
        created: new Date(),
      };

      const result = await context.db.collection("photos").insertOne(newPhoto);
      newPhoto.id = result.insertedId;

      const toPath = path.join(__dirname, 'public', 'photos', `${newPhoto.id}.jpg`)
      const { createReadStream } = await args.input.file
      await uploadStream(createReadStream(), toPath)

      context.pubsub.publish("photo-added", { newPhoto });

      return newPhoto;
    },
    async githubAuth(parent, { code }, { db }) {
      const { message, access_token, avatar_url, login, name } =
        await authorizeWithGithub({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
        });

      if (message) {
        throw new Error(message);
      }

      const latestUserInfo = {
        name,
        githubLogin: login,
        githubToken: access_token,
        avatar: avatar_url,
      };

      const result = await db
        .collection("users")
        .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });
			
			result.upserted && pubsub.publish('user-added', { newUser: latestUserInfo })

      return { user: latestUserInfo, token: access_token };
    },
    addFakeUsers: async (root, { count }, { db, pubsub }) => {
      const users = await getFakeUsers(count);

      users.forEach((user) => {
        pubsub.publish("user-added", { newUser: user });
      });

      await db.collection("users").insertMany(users);
      return users;
    },
    fakeUserAuth: async (root, { githubLogin }, { db }) => {
      const user = await db.collection("users").findOne({ githubLogin });

      if (!user) {
        throw new Error(`Cannot find user with githubLogin ${githubLogin}`);
      }

      return {
        token: user.githubToken,
        user,
      };
    },
  },
  Subscription: {
    newPhoto: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator("photo-added");
      },
    },
    newUser: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator("user-added");
      },
    },
  },
  // トリビアルリゾルバなるもの(ルートのresolverに定義されるオブジェクト)
  //
  // ここでは、永続化する必要がなく都度導出の値URLを返却するために利用する
  Photo: {
    // parentはPhotoを表す
    id: (parent) =>
      // DBから取得したオブジェクトはautoIncrementによりカラム名が_idになってる
      parent.id || parent._id,
    url: (parent) => `http://foo.bar/img/${parent._id}.jpg`,
    postedBy: (parent, args, { db }) => {
      return db.collection("users").findOne({ githubLogin: parent.userId });
    },
    taggedUsers: (parent) => {
      const targetPhotoTags = tags.filter((t) => t.photoId === parent.id);
      return targetPhotoTags.map(({ userId }) =>
        users.find((u) => u.githubLogin === userId)
      );
    },
  },
  User: {
    postedPhotos: (parent) => {
      return photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    inPhotos: (parent) => {
      const targetUserTags = tags.filter(
        (t) => t.userId === parent.githubLogin
      );
      return targetUserTags.map(({ photoId }) => {
        photos.find((p) => p.id === photoId);
      });
    },
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "a valid date time value",
    // レスポンスで返す際の型変換を実装する必要がある
    // シリアライズがしっくりこない。stringifyがしっくりくる
    serialize: (value) => new Date(value).toISOString(),
    // リクエスト値をresolverにわたす前に整形する実装
    // クエリ変数で利用される場合はこっち
    // eg) query recentPost($after: DateTime)
    parseValue: (value) => new Date(value),
    // クエリに直接文字列を書く場合はこっち
    // eg) query recentPost(after: '2021/01/01')
    parseLiteral: (ast) => ast.value,
  }),
};
