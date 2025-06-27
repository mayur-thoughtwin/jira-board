import { auhtResolvers } from "./auth/auth.resolver";
import { authTypeDefs } from "./auth/auth.typedef";
import { sprintResolvers } from "./sprint/sprint.resolver";
import { sprintTypeDefs } from "./sprint/sprint.typedef";
import { boardStatusResolvers } from "./boardStatus/board.resolover";
import { boardStatusTypeDefs } from "./boardStatus/board.typedef";
import { projectResolvers } from "./project/project.resolver";
import { projectTypeDefs } from "./project/project.typedef";
import { projectCategoryResolvers } from "./projectCategory/project.category.resolver";
import { projectCategoryTypeDefs } from "./projectCategory/project.category.typedef";
import { ticketResolvers } from "./ticket/ticket.resolver";
import { ticketTypeDefs } from "./ticket/ticket.typedef";

export const typeDefs = [
  authTypeDefs,
  projectTypeDefs,
  projectCategoryTypeDefs,
  boardStatusTypeDefs,
  ticketTypeDefs,
  sprintTypeDefs,
];
export const resolvers = [
  auhtResolvers,
  projectResolvers,
  projectCategoryResolvers,
  boardStatusResolvers,
  ticketResolvers,
  sprintResolvers,
];
