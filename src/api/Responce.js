class Responce {
  static json({ req, res, next }, data) {
    res.status(200).json(data);
  }

  static ok({ req, res, next }) {
    res.sendStatus(200);
  }

  static session({ req, res, next }, { toCookies, toSent }) {
    req.session.user = { ...toCookies };
    req.session.save(() => Responce.json({ req, res, next }, { ...toSent }));
  }
}

module.exports = Responce;
