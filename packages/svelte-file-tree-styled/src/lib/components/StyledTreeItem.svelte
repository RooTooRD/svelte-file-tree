<script lang="ts">
	import {ChevronDown, File, Folder, FolderOpen} from 'lucide-svelte'
	import {
		TreeItem,
		TreeItemInput,
		type PasteOperation,
		type TreeItemState,
	} from "svelte-file-tree";
	import type { EventHandler } from "svelte/elements";
	import TreeContextMenu from "./TreeContextMenu.svelte";

	let {
		item,
		onExpand,
		onCollapse,
		onCopy,
		onPaste,
		onDelete,
		onAdd,
	}: {
		item: TreeItemState;
		onExpand: () => void;
		onCollapse: () => void;
		onCopy: (operation: PasteOperation) => void;
		onPaste: () => void;
		onDelete: () => void;
		onAdd: () => void;
	} = $props();

	let editing = $state.raw(false);

	const handleToggleButtonClick: EventHandler<MouseEvent> = (event) => {
		if (item.expanded()) {
			onCollapse();
		} else {
			onExpand();
		}

		event.stopPropagation();
		event.currentTarget.parentElement?.focus();
	};
</script>

<TreeContextMenu {item} bind:editing {onCopy} {onPaste} {onDelete} {onAdd}>
	<TreeItem
		bind:editing
		draggable
		class={({ dropPosition }) => [
			"relative flex items-center rounded-md border border-neutral-400 p-3 hover:bg-neutral-200 focus:outline-2 focus:outline-offset-2 focus:outline-current active:bg-neutral-300 aria-selected:border-blue-400 aria-selected:bg-blue-100 aria-selected:text-blue-800 aria-selected:active:bg-blue-200",
			item.dragged() && "opacity-50",
			dropPosition() !== undefined &&
				"before:pointer-events-none before:absolute before:-inset-[2px] before:rounded-[inherit] before:border-2",
			dropPosition() === "before" && "before:border-transparent before:border-t-red-500",
			dropPosition() === "after" && "before:border-transparent before:border-b-red-500",
			dropPosition() === "inside" && "before:border-red-500",
		]}
	>
		<button
			aria-expanded={item.expanded()}
			tabindex={-1}
			class={[
				"rounded-full transition-transform duration-200 hover:bg-current/8 active:bg-current/12",
				item.expanded() && "-rotate-90",
				item.node.type === "file" && "invisible",
			]}
			onclick={handleToggleButtonClick}
		>
			<span class="sr-only">Toggle expansion</span>
			<ChevronDown role="presentation" size={20} />
		</button>

		<div class="ms-1 me-2">
			{#if item.node.type === "file"}
				<File role="presentation" />
			{:else if item.expanded()}
				<FolderOpen role="presentation" class="fill-blue-300" />
			{:else}
				<Folder role="presentation" class="fill-blue-300" />
			{/if}
		</div>

		{#if editing}
			<TreeItemInput class="border bg-white focus:outline-none" />
		{:else}
			<span class="select-none">{item.node.data.name}</span>
		{/if}
	</TreeItem>
</TreeContextMenu>
