function manageQuery(res, err, results) {
  if (err) return res.status(500).json({ error: err });

  return res.status(200).json(results);
}

module.exports = manageQuery;
