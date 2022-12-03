import * as dotenv from 'dotenv';
dotenv.config();
export const PlanIds = {
  planOne: { id: process.env.planOne as string, spaces: 100 },
  planTwo: { id: process.env.planTwo as string, spaces: 500 },
  planThree: { id: process.env.planThree as string, spaces: 1000 },
  planFour: { id: process.env.planFour as string, spaces: 2000 },
};
