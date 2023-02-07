/**
 * this module exports a router containing routes that will query
 * a mongo database and return the info as json to the user
 * 
 * @author Rim Dallali
 */

import * as express from "express";

const router = express.Router();

const quoteRoute = "/quote";

router.use(express.json());

/**
 * endpoint randomly picks from a random hardcoded quote and sends it to the user
 */
router.get("/quote", async function (_, res) {
  const quotes = 
    [
      "This is a random quote that I wrote on the spot.",
      "Did you know that the critically acclaimed MMORPG Final Fantasy XIV has a free trial, " +
      "and includes the entirety of A Realm Reborn AND the award-winning Heavensward expansion " +
      "up to level 60 with no restrictions on playtime? Sign up, and enjoy Eorzea today! " +
      "https://secure.square-enix.com/account/app/svc/ffxivregister?lng=en-gb",
      "The Shining (1980) is a horror film directed by Stanley Kubrick. " +
      "It follows a family who heads to an isolated hotel for the winter, where a sinister " +
      "presence influences the father into violence. His psychic son sees horrific forebodings " +
      "from both past and future. The movie is praised for its chilling atmosphere, grand " +
      "vision, and Kubrick's unique editing and set mis-arrangements. It captures the viewer's " +
      "attention with its terror and eccentric direction, and its cold-eyed view of the man's " +
      "mind gone overboard. It is considered one of the most terrifying films ever made, " +
      "and is a perfect example of how the presence of evil can be dormant in all of our minds.",
      "Let your plans be dark and impenetrable as night, " +
      "and when you move, fall like a thunderbolt.",
      "'I Have No Mouth, and I Must Scream' is a post-apocalyptic science fiction short story " +
      "by American writer Harlan Ellison. It was first published in the March 1967 issue of IF: " +
      "Worlds of Science Fiction and won a Hugo Award in 1968. The story follows a group of " +
      "five humans who are the only survivors of a genocide operation by a supercomputer called " +
      "AM. AM keeps them captive in an underground housing complex and tortures them for its " + 
      "own pleasure. The group eventually makes a desperate journey to an ice cave in search of" +
      " canned food, only to find that they have no means of opening it. In a moment of clarity, " +
      "Ted realizes their only escape is through death and kills the other four. AM then focuses " +
      // eslint-disable-next-line max-len
      "all its rage on Ted, transforming him into a 'great soft jelly thing' incapable of causing " +
      "itself harm. The story ends with Ted's famous line, 'I have no mouth. And I must scream.'",
      "In the midst of chaos, there is also opportunity",
      "Who wishes to fight must first count the cost",
      "It is easy to love your friend, but sometimes the hardest lesson to learn " +
      "is to love your enemy"
    ];
  const randQuote = Math.floor(Math.random() * quotes.length);
  res.status(200).json({ body: quotes[randQuote] });
});

router.use("/", async function (_, res) {
  console.log("here")
  res.json("Success! Getting to the api!");
});

router.use(function (_, res) {
  res.status(404).json({ error: "Not Found" });
});

export default router;
export { quoteRoute };