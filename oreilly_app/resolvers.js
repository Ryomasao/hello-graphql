const { GraphQLScalarType } = require('graphql')

class PhotoFactory {
	constructor() {
		this.id = 0
	}

	create(input) {
		this.id = this.id + 1
		return {
			id: this.id,
			created: new Date(),
			...input
		}
	}
}

const photoFactory = new PhotoFactory;

const users = [
	{githubLogin: 'u1', name: 'user1'},
	{githubLogin: 'u2', name: 'user2'},
	{githubLogin: 'u3', name: 'user3'}
]

const photos = [
	{id: 100, name: 'p1', description:'this is p1', category: "SELFIE", githubUser: 'u1', created: '2021/01/01'},
	{id: 101, name: 'p2', description:'this is p2', category: "PORTRAIT", githubUser: 'u2', created: '2021/01/02'},
	{id: 102, name: 'p3', description:'this is p3', category: "PORTRAIT", githubUser: 'u2', created: '2021/01/03'},
]

const tags = [
	{photoId: 100, userId: 'u1'},
	{photoId: 101, userId: 'u1'},
	{photoId: 102, userId: 'u2'},
]



module.exports = resolvers = {
	Query: {
		totalPhotos: () => photos.length,
		allPhotos: () => photos
	},
	Mutation: {
		// Mutationのresolverの第1引数って親への参照になるんだっけ？
		postPhoto(parent, args) {
			const newPhoto = photoFactory.create(args.input)
			photos.push(newPhoto)
			return newPhoto
		}
	},
	// トリビアルリゾルバなるもの(ルートのresolverに定義されるオブジェクト)
	// 
	// ここでは、永続化する必要がなく都度導出の値URLを返却するために利用する
	Photo: {
		// parentはPhotoを表す
		url: (parent) => `http://foo.bar/img/${parent.id}.jpg`,
		postedBy: (parent) => {
			return users.find(u => u.githubLogin === parent.githubUser)
		},
		taggedUsers: (parent) => {
			const targetPhotoTags  =  tags.filter(t => t.photoId === parent.id)
			return targetPhotoTags.map(({ userId }) => users.find(u => u.githubLogin === userId))
		}
	},
	User: {
		postedPhotos: (parent) => {
			return photos.filter(p => p.githubUser === parent.githubLogin)
		},
		inPhotos: (parent) => {
			const targetUserTags  =  tags.filter(t => t.userId === parent.githubLogin)
			return targetUserTags.map(({photoId}) => {photos.find(p => p.id === photoId)})
		}
	},
	DateTime: new GraphQLScalarType({
		name: 'DateTime',
		description: 'a valid date time value',
		// レスポンスで返す際の型変換を実装する必要がある
		// シリアライズがしっくりこない。stringifyがしっくりくる
		serialize: value => new Date(value).toISOString(),
		// リクエスト値をresolverにわたす前に整形する実装
		// クエリ変数で利用される場合はこっち
		// eg) query recentPost($after: DateTime)
		parseValue: value => new Date(value),
		// クエリに直接文字列を書く場合はこっち
		// eg) query recentPost(after: '2021/01/01')
		parseLiteral: ast => ast.value
	})
}