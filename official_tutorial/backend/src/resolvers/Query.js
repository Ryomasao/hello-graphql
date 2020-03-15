const feed = async (root, args, context, info) => {
  const where = args.filter
    ? {
        OR: [
          { description_contains: args.filter },
          { url_contains: args.filter }
        ]
      }
    : {};

  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });

  // ↑のとあわせて2回問い合わせが発生するのかしら
  // SQLはどうなってるんだろ
  const count = await context.prisma
    .linksConnection({ where })
    .aggregate()
    .count();

  return {
    links,
    count
  };
};

const link = (root, args, context, info) => {
  return context.prisma.link({ id: args.id });
};

module.exports = {
  feed,
  link
};
