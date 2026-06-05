const mongoose = require("mongoose");

let password = "";
let name = "";
let number = "";

console.log(process.argv.length);

if (
  process.argv.length < 3 ||
  process.argv.length === 4 ||
  process.argv.length > 5
) {
  console.log(
    "There is only 2 options:" +
      "\n - To show phonebook use: node.js mongo.js <password>" +
      "\n - To add persons to phonebook use: node.js mongo.js <password> <person_name> <person_number>",
  );
}

if (process.argv.length === 3) {
  password = process.argv[2];
}

if (process.argv.length === 5) {
  console.log("HELLO!!!!!!!!");
  password = process.argv[2];
  console.log("Password: ",password);
  name = process.argv[3];
  number = process.argv[4];
}

const url = `mongodb+srv://isinaveira_db:${password}@cluster0.l3ommgk.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const person = new Person({
    name: name,
    number: number,
  });
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
