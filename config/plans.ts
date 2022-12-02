import * as dotenv from 'dotenv';
dotenv.config();
export const PlanIds = {
  planOne: process.env.planOne as string,
  planTwo: process.env.planTwo as string,
  planThree: process.env.planThree as string,
  planFour: process.env.planFour as string,
};
