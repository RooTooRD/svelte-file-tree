import { IntSchema } from "$lib/schema.js";
import { DatabaseFileSchema, db } from "$lib/server/database/index.js";
import { maybeThrowError } from "$lib/utils.js";
import { json } from "@sveltejs/kit";
import * as v from "valibot";
import type { RequestHandler } from "./$types.js";

const DeleteFilesBodySchema = v.object({
	deleted: v.array(IntSchema),
	new_positions: v.array(v.pick(DatabaseFileSchema, ["id", "parent_id", "index_in_parent"])),
});

export type DeleteFilesBody = v.InferInput<typeof DeleteFilesBodySchema>;

const deleteFiles = db.transaction((body: DeleteFilesBody): void => {
	body.deleted.forEach(db.deleteFile);
	body.new_positions.forEach(db.updateFilePosition);
});

export const POST: RequestHandler = async ({ request }) => {
	const body = v.parse(DeleteFilesBodySchema, await request.json());

	maybeThrowError();
	deleteFiles(body);

	return json({ success: true });
};
