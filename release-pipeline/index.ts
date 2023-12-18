/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OctoKit, OctoKitIssue } from "../api/octokit";
import { Action } from "../common/Action";
import { getRequiredInput } from "../common/utils";
import { ReleasePipeline, enrollIssue, unenrollIssue } from "./ReleasePipeline";

const notYetReleasedLabel = getRequiredInput("notYetReleasedLabel");
const insidersReleasedLabel = getRequiredInput("insidersReleasedLabel");

class ReleasePipelineAction extends Action {
	id = "ReleasePipeline";

	async onReopened(issue: OctoKitIssue) {
		await unenrollIssue(issue, notYetReleasedLabel, insidersReleasedLabel);
	}

	async onClosed(issue: OctoKitIssue) {
		await enrollIssue(issue, notYetReleasedLabel);
	}

	async onTriggered(github: OctoKit) {
		await new ReleasePipeline(
			github,
			notYetReleasedLabel,
			insidersReleasedLabel,
		).run();
	}

	async onCommented(issue: OctoKitIssue, comment: string) {
		if (comment.includes("closedWith")) {
			await enrollIssue(issue, notYetReleasedLabel);
		}
	}
}

new ReleasePipelineAction().run(); // eslint-disable-line
