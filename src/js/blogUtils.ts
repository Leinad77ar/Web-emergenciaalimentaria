import { type CollectionEntry, getCollection, getEntry } from "astro:content";

// utils
import { slugify } from "@js/textUtils";

// --------------------------------------------------------
/**
 * * returns an array of processed items, sorted by count
 * @param items: string[] - array of items to count and sort
 * note: return looks like { productivity: 2, 'cool-code': 1 }
 */

export function countItems(items: string[]): object {
	// get counts of each item in the array
	const countedItems = items.reduce((acc, item) => {
		const val = acc[slugify(item)] || 0;

		return {
			...acc,
			[slugify(item)]: val + 1,
		};
	}, {});

	return countedItems;
}

// --------------------------------------------------------
/**
 * * returns array of arrays, sorted by value (high value first)
 * @param jsObj: object - array of "key: value" pairs to sort
 * note: return looks like [ [ 'productivity', 2 ], [ 'cool-code', 1 ] ]
 * note: this is used for tag and category cloud ordering
 */
export function sortByValue(jsObj: object): any[] {
	var array: any[] = [];
	for (var i in jsObj) {
		array.push([i, jsObj[i]]);
	}

	const sorted = array.sort((a, b) => {
		return b[1] - a[1];
	});

	// looks like [ [ 'productivity', 2 ], [ 'cool-code', 1 ] ]
	return sorted;
}

// --------------------------------------------------------
/**
 * * returns all blog posts, filtered for drafts, sorted by date, and future posts removed
 * use like `const posts = await getAllPosts();`
 */
export async function getAllPosts(): Promise<CollectionEntry<"blog">[]> {
	const posts = await getCollection("blog", ({ data }) => {
		// filter out draft posts
		return data.draft !== true;
	});

	// filter out future posts and sort by date
	const formattedPosts: CollectionEntry<"blog">[] = formatPosts(posts, {
		filterOutFuturePosts: true,
		sortByDate: true,
		limit: undefined,
	});

	return formattedPosts;
}

// --------------------------------------------------------
/**
 * * returns all blog posts in a formatted array
 * @param posts: CollectionEntry<"blog">[] - array of posts, unformatted
 * note: this has an optional options object, params below
 * @param filterOutFuturePosts: boolean - if true, filters out future posts
 * @param sortByDate: boolean - if true, sorts posts by date
 * @param limit: number - if number is passed, limits the number of posts returned
 */
interface FormatPostsOptions {
	filterOutFuturePosts?: boolean;
	sortByDate?: boolean;
	limit?: number;
}

export function formatPosts(
	posts: CollectionEntry<"blog">[],
	{ filterOutFuturePosts = true, sortByDate = true, limit = undefined }: FormatPostsOptions = {},
): CollectionEntry<"blog">[] {
	const filteredPosts = posts.reduce((acc: CollectionEntry<"blog">[], post) => {
		const { pubDate } = post.data;

		// filterOutFuturePosts if true
		if (filterOutFuturePosts && new Date(pubDate) > new Date()) return acc;

		// add post to acc
		acc.push(post);

		return acc;
	}, []);

	// now we have filteredPosts
	// sortByDate or randomize
	if (sortByDate) {
		filteredPosts.sort(
			(a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
				new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
		);
	} else {
		filteredPosts.sort(() => Math.random() - 0.5);
	}

	// limit if number is passed
	if (typeof limit === "number") {
		return filteredPosts.slice(0, limit);
	}
	return filteredPosts;
}

export async function getAllAuthorsData(
    authors: CollectionEntry<"blog">["data"]["authors"],
): Promise<CollectionEntry<"authors">[]> {
    const authorsData = authors.map(async (author) => {
        try {
            if (!author?.id) {
                console.warn(`Skipping author: Invalid ID`);
                return null;
            }

            const authorData = await getEntry("authors", author.id);

            if (!authorData) {
                console.warn(`Author "${author.id}" not found in "authors" collection.`);
                return null;
            }

            return authorData;
        } catch (error) {
            console.error(`Error fetching author "${author.id}":`, error);
            return null;
        }
    });

    // Aquí sigue el `.map()`, pero el `Promise.all()` se usa para esperar todas las promesas antes de devolver los resultados
    return Promise.all(authorsData).then((data) => data.filter(Boolean));
}
