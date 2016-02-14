module.exports = exports = (values, res) => {
  if (values[0].length) {
    res.status(200).json({
      gameStatus: '-----GAME OVER-----',
      msg: 'Towns win! ' + values[0].length + ' towns left and mafias are all eliminated.'
    });
  } else {
    res.status(200).json({
      gameStatus: '-----GAME OVER-----',
      msg: 'Mafias win! ' + values[1].length + ' mafias left and towns have all been eliminated.'
    });
  }
};
