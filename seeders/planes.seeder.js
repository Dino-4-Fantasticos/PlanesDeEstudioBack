// import { Seeder } from 'mongoose-data-seed';
// import { Plan } from '../server/models';

const { Seeder } = require('mongoose-data-seed');
const Plan = require('../src/planes/model');

const data = [
  {
    esVigente: true,
    esTec21: false,
    siglas: "ITC11",
    nombre: "Ingeniería en Tecnologías Computacionales",
    materias: []
  }
];

class PlanesSeeder extends Seeder {

  async shouldRun() {
    console.log("\n-------------shouldRun----------------");
    console.log("Plan", Plan);
    console.log("data:", data);
    console.log("Plan.create(data): ", Plan.create(data));

    console.log("-------------------------------------\n");

    return Plan.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    console.log("\n---------------run-------------------");
    console.log("data:", data);
    console.log("-------------------------------------\n");

    return Plan.create(data);
  }
}

console.log("\n--------------seeder-----------------");
console.log("Planes: ", PlanesSeeder);
console.log("Plan", Plan);
console.log("-------------------------------------\n");

// export default PlanesSeeder;
module.exports = PlanesSeeder;
