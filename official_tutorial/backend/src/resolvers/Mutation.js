const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return { token, user };
};

const login = async (parent, args, context, info) => {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

const post = (parent, args, context, info) => {
  const userId = getUserId(context);

  // Promise返すんだけど、どのレイヤでawaitしてんだろ
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    // connectっていうのもprismaの仕様っぽい
    // https://www.prisma.io/docs/prisma-client/basic-data-access/writing-data-JAVASCRIPT-rsc6/
    // Schemaで、とあるtypeが別typeを包括している場合、RDB的には、2レコード分更新してるようなイメージになってるんだと思う。
    postedBy: { connect: { id: userId } }
  });
};

// https://www.prisma.io/docs/prisma-client/basic-data-access/reading-data-JAVASCRIPT-rsc2/
// https://www.prisma.io/docs/prisma-client/basic-data-access/writing-data-JAVASCRIPT-rsc6/
const updateLink = (parent, args, context, info) => {
  const { id, ...updatedData } = args;
  return context.prisma.updateLink({
    data: {
      ...updatedData
    },
    where: { id }
  });
};

const deleteLink = (parent, args, context, info) => {
  return context.prisma.deleteLink({ id: args.id });
};

const vote = async (parent, args, context, info) => {
  const userId = getUserId(context);

  const voteExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });

  // TODO vote取り消し機能がほしい
  if (voteExists) {
    throw new Error(`Already voted for link:${args.linkId}`);
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  });
};

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink,
  vote
};
