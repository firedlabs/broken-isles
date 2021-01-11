module.exports = async function (context, myQueueItem) {
  context.log("Chegou infos na fila newauthtwitch", myQueueItem);
};
