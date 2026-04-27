// @ts-nocheck
import * as __fd_glob_28 from "../content/docs/user-guides/resume-templates.mdx?collection=docs"
import * as __fd_glob_27 from "../content/docs/user-guides/exporting-and-sharing.mdx?collection=docs"
import * as __fd_glob_26 from "../content/docs/operations/service-status.mdx?collection=docs"
import * as __fd_glob_25 from "../content/docs/operations/environment-variables.mdx?collection=docs"
import * as __fd_glob_24 from "../content/docs/getting-started/quick-start.mdx?collection=docs"
import * as __fd_glob_23 from "../content/docs/getting-started/local-setup.mdx?collection=docs"
import * as __fd_glob_22 from "../content/docs/getting-started/docker-deployment.mdx?collection=docs"
import * as __fd_glob_21 from "../content/docs/overview.mdx?collection=docs"
import * as __fd_glob_20 from "../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_19 } from "../content/docs/meta.json?collection=docs"
import * as __fd_glob_18 from "../content/api-reference/users/updateUserName.mdx?collection=api"
import * as __fd_glob_17 from "../content/api-reference/users/index.mdx?collection=api"
import * as __fd_glob_16 from "../content/api-reference/users/getCurrentUser.mdx?collection=api"
import * as __fd_glob_15 from "../content/api-reference/roadmap/index.mdx?collection=api"
import * as __fd_glob_14 from "../content/api-reference/roadmap/getRoadmapStats.mdx?collection=api"
import * as __fd_glob_13 from "../content/api-reference/roadmap/getRoadmapFeatureById.mdx?collection=api"
import * as __fd_glob_12 from "../content/api-reference/roadmap/getRoadmap.mdx?collection=api"
import * as __fd_glob_11 from "../content/api-reference/health/index.mdx?collection=api"
import * as __fd_glob_10 from "../content/api-reference/health/healthCheck.mdx?collection=api"
import * as __fd_glob_9 from "../content/api-reference/github/syncGitHubStats.mdx?collection=api"
import * as __fd_glob_8 from "../content/api-reference/github/index.mdx?collection=api"
import * as __fd_glob_7 from "../content/api-reference/github/getGitHubStats.mdx?collection=api"
import * as __fd_glob_6 from "../content/api-reference/github/getGitHubIssues.mdx?collection=api"
import * as __fd_glob_5 from "../content/api-reference/index.mdx?collection=api"
import { default as __fd_glob_4 } from "../content/api-reference/users/meta.json?collection=api"
import { default as __fd_glob_3 } from "../content/api-reference/roadmap/meta.json?collection=api"
import { default as __fd_glob_2 } from "../content/api-reference/health/meta.json?collection=api"
import { default as __fd_glob_1 } from "../content/api-reference/github/meta.json?collection=api"
import { default as __fd_glob_0 } from "../content/api-reference/meta.json?collection=api"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const api = await create.docs("api", "content/api-reference", {"meta.json": __fd_glob_0, "github/meta.json": __fd_glob_1, "health/meta.json": __fd_glob_2, "roadmap/meta.json": __fd_glob_3, "users/meta.json": __fd_glob_4, }, {"index.mdx": __fd_glob_5, "github/getGitHubIssues.mdx": __fd_glob_6, "github/getGitHubStats.mdx": __fd_glob_7, "github/index.mdx": __fd_glob_8, "github/syncGitHubStats.mdx": __fd_glob_9, "health/healthCheck.mdx": __fd_glob_10, "health/index.mdx": __fd_glob_11, "roadmap/getRoadmap.mdx": __fd_glob_12, "roadmap/getRoadmapFeatureById.mdx": __fd_glob_13, "roadmap/getRoadmapStats.mdx": __fd_glob_14, "roadmap/index.mdx": __fd_glob_15, "users/getCurrentUser.mdx": __fd_glob_16, "users/index.mdx": __fd_glob_17, "users/updateUserName.mdx": __fd_glob_18, });

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_19, }, {"index.mdx": __fd_glob_20, "overview.mdx": __fd_glob_21, "getting-started/docker-deployment.mdx": __fd_glob_22, "getting-started/local-setup.mdx": __fd_glob_23, "getting-started/quick-start.mdx": __fd_glob_24, "operations/environment-variables.mdx": __fd_glob_25, "operations/service-status.mdx": __fd_glob_26, "user-guides/exporting-and-sharing.mdx": __fd_glob_27, "user-guides/resume-templates.mdx": __fd_glob_28, });