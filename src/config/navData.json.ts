// utils
import { getAllPosts, countItems, sortByValue } from "@js/blogUtils";
import { humanize } from "@js/textUtils";

// get the categories used in blog posts, to put into navbar
const posts = await getAllPosts();
const allCategories = posts.map((post) => post.data.categories).flat();
const countedCategories = countItems(allCategories);
const processedCategories = sortByValue(countedCategories);

export interface navLinkItem {
	text: string;
	link: string;
	newTab?: boolean; // adds target="_blank" rel="noopener noreferrer" to link
}

export interface navDropdownItem {
	text: string;
	dropdown: navLinkItem[];
}

export type navItem = navLinkItem | navDropdownItem;

// note: 1 level of dropdown is supported
const navConfig: navItem[] = [
	// {
	// 	text: "Nosotros",
	// 	link: "/blog/",
	// },
	// {
		// get the categories used in blog posts, to put into a navbar dropdown
	// 	text: "Categories",
	// 	dropdown: processedCategories.map(([category, count]) => {
	// 		return {
	// 			text: humanize(category),
	// 			link: `/categories/${category}/`,
	// 		};
	// 	}),
	// },
	// {
	// 	text: "Pages",
	// 	dropdown: [
	// 		{
	// 			text: "Categories",
	// 			link: "/categories/",
	// 		},
	// 		{
	// 			text: "Elements",
	// 			link: "/elements/",
	// 		},
	// 		{
	// 			text: "Privacy Policy",
	// 			link: "/privacy-policy/",
	// 		},
	// 		{
	// 			text: "404",
	// 			link: "/not-a-link/",
	// 		},
	// 		{
	// 			text: "RSS Feed",
	// 			link: "/rss.xml",
	// 			newTab: true,
	// 		},
	// 	],
	// },
	{
		text: "Propuesta",
		link: "/propuestas/",
	},
];

export default navConfig;
