/**
 * this module imports the app module and starts a local express server
 * 
 * @author Rim Dallali
 */

import app from "../routes/app.js";

const PORT = process.env.PORT || 8080; 

app.listen(PORT, function(){
  console.log("Server Started on port: http://localhost:" + PORT);
});