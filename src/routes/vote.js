const express = require("express")

const Vote = require("../models/Vote")

const router = express.Router()

router.get("/", [], async ({query: {limit, page, ...params}}, res) => {
  try {
    if (page || limit) {
      page ||= 1
      limit ||= 12
      const votes = await Vote.find(params)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({date: -1})
      res.json(votes)
    } else {
      const votes = await Vote.find(params).sort({date: -1})
      res.json(votes)
    }
  } catch (error) {
    console.error(error)
    res.status(500).send(`Server error (ノಠ益ಠ)ノ彡┻━┻ ${error.message}`)
  }
})

router.post(
  "/",
  [],
  async (
    {body: {ballot, category, creatorId, creatorName, subcategory, timeframe}},
    res,
  ) => {
    try {
      const newVote = new Vote({
        ballot,
        category,
        creatorId,
        creatorName,
        subcategory,
        timeframe,
      })
      const savedVote = await newVote.save()
      res.json(savedVote)
    } catch (error) {
      console.error(error)
      res.status(500).send(`Server error (ノಠ益ಠ)ノ彡┻━┻ ${error.message}`)
    }
  },
)

router.put("/:id", [], async ({body: {ballot}, params: {id}}, res) => {
  try {
    let vote = await Vote.findById(id)
    if (!vote) return res.status(404).send("Vote not found")
    vote = await Vote.findByIdAndUpdate(id, {$set: {ballot}}, {new: true})
    res.json(vote)
  } catch (error) {
    console.error(error.message)
    res.status(500).send(`Server error (ノಠ益ಠ)ノ彡┻━┻ ${error.message}`)
  }
})

module.exports = router
