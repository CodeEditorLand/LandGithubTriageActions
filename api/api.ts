/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface GitHub {
	repoOwner: string;

	repoName: string;

	query(query: Query): AsyncIterableIterator<GitHubIssue[]>;

	hasWriteAccess(username: string): Promise<boolean>;

	repoHasLabel(label: string): Promise<boolean>;

	createLabel(
		label: string,
		color: string,
		description: string,
	): Promise<void>;

	deleteLabel(label: string): Promise<void>;

	readConfig(path: string): Promise<any>;

	dispatch(title: string): Promise<void>;

	createIssue(
		owner: string,
		repo: string,
		title: string,
		body: string,
	): Promise<void>;

	releaseContainsCommit(
		release: string,
		commit: string,
	): Promise<"yes" | "no" | "unknown">;

	/**
	 * Returns what we think the current milestone for the repo is based on the due on date and if we are in endgame
	 * @returns The milestone id if one is found, else undefined
	 */
	getCurrentRepoMilestone(isEndGame?: boolean): Promise<number | undefined>;
}

export interface GitHubIssue extends GitHub {
	getIssue(): Promise<Issue | undefined>;

	postComment(body: string): Promise<void>;

	deleteComment(id: number): Promise<void>;

	getComments(last?: boolean): AsyncIterableIterator<Comment[]>;

	closeIssue(reason: "completed" | "not_planned"): Promise<void>;

	lockIssue(): Promise<void>;

	unlockIssue(): Promise<void>;

	setMilestone(milestoneId: number): Promise<void>;

	addLabel(label: string): Promise<void>;

	removeLabel(label: string): Promise<void>;

	addAssignee(assignee: string): Promise<void>;

	removeAssignee(assignee: string): Promise<void>;

	getClosingInfo(): Promise<
		{ hash: string | undefined; timestamp: number } | undefined
	>;
}

type SortVar =
	| "comments"
	| "reactions"
	| "reactions-+1"
	| "reactions--1"
	| "reactions-smile"
	| "reactions-thinking_face"
	| "reactions-heart"
	| "reactions-tada"
	| "interactions"
	| "created"
	| "updated";
type SortOrder = "asc" | "desc";

export type Reactions = {
	"+1": number;
	"-1": number;

	laugh: number;

	hooray: number;

	confused: number;

	heart: number;

	rocket: number;

	eyes: number;
};

export interface User {
	name: string;

	isGitHubApp?: boolean;
}
export interface Comment {
	author: User;

	body: string;

	id: number;

	timestamp: number;
}
export interface Issue {
	author: User;

	body: string;

	title: string;

	labels: string[];

	open: boolean;

	locked: boolean;

	number: number;

	isPr: boolean;

	numComments: number;

	reactions: Reactions;

	milestone: Milestone | null;

	assignee?: string;

	assignees: string[];

	createdAt: number;

	updatedAt: number;

	closedAt?: number;
}
export interface Milestone {
	milestoneId: number;

	title: string;

	description: string;

	numClosedIssues: number;

	numOpenIssues: number;

	dueOn: Date | null;

	createdAt: Date | null;

	closedAt: Date | null;

	state: "open" | "closed";
}
export interface Query {
	q: string;

	sort?: SortVar;

	order?: SortOrder;

	per_page?: number;
}
