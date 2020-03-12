const feed = (root, args, context, info) => {
  return context.prisma.links()
}

const link = (root, args, context, info) => {
  return context.prisma.link({ id: args.id })
}

module.exports = {
  feed,
  link
}