const Problem = require('../models/problemmodel');
const mongoose = require('mongoose');

// Add new problems using this

const mockProblems = [
  {
        pid: 1,
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
        difficulty: "Easy",
        topics: ["Array", "Hash Table"],
        solved: 1250,
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
        examples: [
        {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
        }
        ]
  },
  {
        pid: 2,
        title: "Reverse Integer",
        description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range, then return 0.",
        difficulty: "Medium",
        topics: ["Math"],
        solved: 980,
        constraints: ["-2^31 <= x <= 2^31 - 1"],
        examples: [
        {
            input: "x = 123",
            output: "321",
            explanation: "Reversed integer is 321."
        },
        {
            input: "x = -120",
            output: "-21",
            explanation: "Reversed integer is -21."
        }
        ]
  },
  {
        pid: 3,
        title: "Palindrome Number",
        description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
        difficulty: "Easy",
        topics: ["Math"],
        solved: 1750,
        constraints: ["-2^31 <= x <= 2^31 - 1"],
        examples: [
        {
            input: "x = 121",
            output: "true",
            explanation: "121 reads the same backward."
        },
        {
            input: "x = -121",
            output: "false",
            explanation: "Negative sign makes it not palindrome."
        }
        ]
  },
  {
        pid: 4,
        title: "Roman to Integer",
        description: "Convert a Roman numeral to an integer.",
        difficulty: "Easy",
        topics: ["Hash Table", "Math", "String"],
        solved: 640,
        constraints: ["1 <= s.length <= 15", "s contains only the characters ('I','V','X','L','C','D','M')"],
        examples: [
        {
            input: "s = \"III\"",
            output: "3",
            explanation: "III = 3."
        },
        {
            input: "s = \"LVIII\"",
            output: "58",
            explanation: "L = 50, V= 5, III = 3."
        }
        ]
  },
  {
        pid: 5,
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets are closed by the same type of brackets, Open brackets are closed in the correct order.",
        difficulty: "Easy",
        topics: ["String", "Stack"],
        solved: 1170,
        constraints: ["1 <= s.length <= 10^4", "s consists only of parentheses characters."],
        examples: [
        {
            input: "s = \"()\"",
            output: "true",
            explanation: "Simple valid parentheses."
        },
        {
            input: "s = \"([)]\"",
            output: "false",
            explanation: "Wrong closing order."
        }
        ]
  },
  {
        pid: 6,
        title: "Merge Two Sorted Lists",
        description: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
        difficulty: "Easy",
        topics: ["Linked List"],
        solved: 970,
        constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100"],
        examples: [
        {
            input: "l1 = [1,2,4], l2 = [1,3,4]",
            output: "[1,1,2,3,4,4]",
            explanation: "Merged list in sorted order."
        }
        ]
  },
  {
        pid: 7,
        title: "Reverse Linked List",
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        difficulty: "Easy",
        topics: ["Linked List", "Recursion"],
        solved: 843,
        constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
        examples: [
            {
                input: "head = [1,2,3,4,5]",
                output: "[5,4,3,2,1]",
                explanation: "The linked list is reversed."
            },
            {
                input: "head = [1,2]",
                output: "[2,1]",
                explanation: "The linked list is reversed."
            }
        ]
    },
    {
        pid: 8,
        title: "Binary Tree Level Order Traversal",
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
        difficulty: "Medium",
        topics: ["Tree", "BFS"],
        solved: 621,
        constraints: ["The number of nodes in the tree is in the range [0, 2000].", "-1000 <= Node.val <= 1000"],
        examples: [
            {
                input: "root = [3,9,20,null,null,15,7]",
                output: "[[3],[9,20],[15,7]]",
                explanation: "Nodes are traversed level by level."
            },
            {
                input: "root = [1]",
                output: "[[1]]",
                explanation: "There's only one node."
            }
        ]
    },
    {
        pid: 9,
        title: "Longest Palindromic Substring",
        description: "Given a string s, return the longest palindromic substring in s.",
        difficulty: "Medium",
        topics: ["String", "Dynamic Programming"],
        solved: 542,
        constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters."],
        examples: [
            {
                input: "s = \"babad\"",
                output: "\"bab\"",
                explanation: "\"aba\" is also a valid answer."
            },
            {
                input: "s = \"cbbd\"",
                output: "\"bb\"",
                explanation: "The longest palindrome is \"bb\"."
            }
        ]
    },
    {
        pid: 10,
        title: "Merge k Sorted Lists",
        description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        difficulty: "Hard",
        topics: ["Linked List", "Divide and Conquer"],
        solved: 321,
        constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "-10^4 <= lists[i][j] <= 10^4", "lists[i] is sorted in ascending order."],
        examples: [
            {
                input: "lists = [[1,4,5],[1,3,4],[2,6]]",
                output: "[1,1,2,3,4,4,5,6]",
                explanation: "The linked-lists are merged into one sorted list."
            },
            {
                input: "lists = []",
                output: "[]",
                explanation: "No lists to merge."
            }
        ]
    },
    {
        pid: 11,
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        difficulty: "Medium",
        topics: ["Hash Table", "Sliding Window"],
        solved: 1850,
        constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
        examples: [
            {
                input: "s = \"abcabcbb\"",
                output: "3",
                explanation: "The answer is \"abc\", with the length of 3."
            },
            {
                input: "s = \"bbbbb\"",
                output: "1",
                explanation: "The answer is \"b\", with the length of 1."
            }
        ]
    },
    {
        pid: 12,
        title: "Zigzag Conversion",
        description: "The string \"PAYPALISHIRING\" is written in a zigzag pattern on a given number of rows. Write the code that will take a string and make this conversion given a number of rows.",
        difficulty: "Medium",
        topics: ["String"],
        solved: 1200,
        constraints: ["1 <= s.length <= 1000", "s consists of English letters (lower-case and upper-case), ',' and '.'.", "1 <= numRows <= 1000"],
        examples: [
            {
                input: "s = \"PAYPALISHIRING\", numRows = 3",
                output: "\"PAHNAPLSIIGYIR\"",
                explanation: "P   A   H   N\nA P L S I I G\nY   I   R"
            },
            {
                input: "s = \"PAYPALISHIRING\", numRows = 4",
                output: "\"PINALSIGYAHRPI\"",
                explanation: "P     I    N\nA   L S  I G\nY A   H R\nP     I"
            }
        ]
    },
    {
        pid: 13,
        title: "Container With Most Water",
        description: "Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of the line i is at (i, ai) and (i, 0). Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.",
        difficulty: "Medium",
        topics: ["Array", "Two Pointers"],
        solved: 2100,
        constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
        examples: [
            {
                input: "height = [1,8,6,2,5,4,8,3,7]",
                output: "49",
                explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. The container between 8 (index 1) and 7 (index 8) holds the most water."
            },
            {
                input: "height = [1,1]",
                output: "1",
                explanation: "The container between the two 1's holds 1 unit of water."
            }
        ]
    },
    {
        pid: 14,
        title: "3Sum",
        description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.",
        difficulty: "Medium",
        topics: ["Array", "Two Pointers"],
        solved: 1750,
        constraints: ["0 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
        examples: [
            {
                input: "nums = [-1,0,1,2,-1,-4]",
                output: "[[-1,-1,2],[-1,0,1]]",
                explanation: "These are the unique triplets that sum to 0."
            },
            {
                input: "nums = []",
                output: "[]",
                explanation: "No possible triplets."
            }
        ]
    },
    {
        pid: 15,
        title: "Remove Nth Node From End of List",
        description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
        difficulty: "Medium",
        topics: ["Linked List", "Two Pointers"],
        solved: 1600,
        constraints: ["The number of nodes in the list is sz.", "1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"],
        examples: [
            {
                input: "head = [1,2,3,4,5], n = 2",
                output: "[1,2,3,5]",
                explanation: "The 2nd node from the end is removed."
            },
            {
                input: "head = [1], n = 1",
                output: "[]",
                explanation: "The only node is removed."
            }
        ]
    },
    {
        pid: 16,
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        difficulty: "Hard",
        topics: ["Array", "Binary Search"],
        solved: 950,
        constraints: ["nums1.length == m", "nums2.length == n", "0 <= m <= 1000", "0 <= n <= 1000", "1 <= m + n <= 2000", "-10^6 <= nums1[i], nums2[i] <= 10^6"],
        examples: [
            {
                input: "nums1 = [1,3], nums2 = [2]",
                output: "2.00000",
                explanation: "merged array = [1,2,3] and median is 2."
            },
            {
                input: "nums1 = [1,2], nums2 = [3,4]",
                output: "2.50000",
                explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
            }
        ]
    },
    {
        pid: 17,
        title: "Regular Expression Matching",
        description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where: '.' Matches any single character. '*' Matches zero or more of the preceding element.",
        difficulty: "Hard",
        topics: ["String", "Dynamic Programming"],
        solved: 850,
        constraints: ["1 <= s.length <= 20", "1 <= p.length <= 30", "s contains only lowercase English letters.", "p contains only lowercase English letters, '.', and '*'.", "It is guaranteed for each appearance of the character '*', there will be a previous valid character to match."],
        examples: [
            {
                input: "s = \"aa\", p = \"a\"",
                output: "false",
                explanation: "\"a\" does not match the entire string \"aa\"."
            },
            {
                input: "s = \"aa\", p = \"a*\"",
                output: "true",
                explanation: "'*' means zero or more of the preceding element, 'a'. Therefore, \"a\" is repeated once."
            }
        ]
    },
    {
        pid: 18,
        title: "First Missing Positive",
        description: "Find the smallest missing positive integer in an unsorted array.",
        difficulty: "Hard",
        topics: ["Array"],
        solved: 1100,
        constraints: ["1 <= nums.length <= 5 * 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
        examples: [
            {
                input: "nums = [1,2,0]",
                output: "3",
                explanation: "The numbers 0, 1, and 2 are present. The smallest missing positive is 3."
            },
            {
                input: "nums = [3,4,-1,1]",
                output: "2",
                explanation: "1 is present but 2 is missing."
            }
        ]
    },
    {
        pid: 19,
        title: "Trapping Rain Water",
        description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        difficulty: "Hard",
        topics: ["Array", "Two Pointers"],
        solved: 1950,
        constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
        examples: [
            {
                input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
                output: "6",
                explanation: "The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped."
            },
            {
                input: "height = [4,2,0,3,2,5]",
                output: "9",
                explanation: "9 units of rain water are being trapped."
            }
        ]
    },
    {
        pid: 20,
        title: "Valid Sudoku",
        description: "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules: Each row must contain the digits 1-9 without repetition. Each column must contain the digits 1-9 without repetition. Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.",
        difficulty: "Medium",
        topics: ["Hash Table", "Matrix"],
        solved: 1450,
        constraints: ["board.length == 9", "board[i].length == 9", "board[i][j] is a digit 1-9 or '.'."],
        examples: [
            {
                input: "board = \n[[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"]\n,[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"]\n,[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"]\n,[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"]\n,[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"]\n,[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"]\n,[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"]\n,[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"]\n,[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]",
                output: "true",
                explanation: "The board follows all Sudoku rules."
            },
            {
                input: "board = \n[[\"8\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"]\n,[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"]\n,[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"]\n,[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"]\n,[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"]\n,[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"]\n,[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"]\n,[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"]\n,[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]",
                output: "false",
                explanation: "There are two 8's in the first column which violates the rules."
            }
        ]
    },
    {
        pid: 21,
        title: "Rotate Image",
        description: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly.",
        difficulty: "Medium",
        topics: ["Array", "Matrix"],
        solved: 1650,
        constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 20", "-1000 <= matrix[i][j] <= 1000"],
        examples: [
            {
                input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
                output: "[[7,4,1],[8,5,2],[9,6,3]]",
                explanation: "The matrix is rotated 90 degrees clockwise."
            },
            {
                input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
                output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
                explanation: "The matrix is rotated 90 degrees clockwise."
            }
        ]
    },
    {
        pid: 22,
        title: "Group Anagrams",
        description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
        difficulty: "Medium",
        topics: ["Hash Table", "String"],
        solved: 1900,
        constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
        examples: [
            {
                input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
                output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
                explanation: "Anagrams are grouped together."
            },
            {
                input: "strs = [\"\"]",
                output: "[[\"\"]]",
                explanation: "The only string is grouped by itself."
            }
        ]
    },
    {
        pid: 23,
        title: "Maximum Product Subarray",
        description: "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.",
        difficulty: "Medium",
        topics: ["Array", "Dynamic Programming"],
        solved: 1250,
        constraints: ["1 <= nums.length <= 2 * 10^4", "-10 <= nums[i] <= 10", "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer."],
        examples: [
            {
                input: "nums = [2,3,-2,4]",
                output: "6",
                explanation: "[2,3] has the largest product 6."
            },
            {
                input: "nums = [-2,0,-1]",
                output: "0",
                explanation: "The result cannot be 2, because [-2,-1] is not a subarray."
            }
        ]
    },
    {
        pid: 24,
        title: "Word Break",
        description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
        difficulty: "Medium",
        topics: ["Hash Table", "Dynamic Programming"],
        solved: 1500,
        constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "1 <= wordDict[i].length <= 20", "s and wordDict[i] consist of only lowercase English letters.", "All the strings of wordDict are unique."],
        examples: [
            {
                input: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
                output: "true",
                explanation: "Return true because \"leetcode\" can be segmented as \"leet code\"."
            },
            {
                input: "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]",
                output: "true",
                explanation: "Return true because \"applepenapple\" can be segmented as \"apple pen apple\"."
            }
        ]
    },
    {
            pid: 25,
            title: "Sliding Window Maximum",
            description: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window - an array containing the maximum number from each window position.",
            difficulty: "Hard",
            topics: ["Array", "Queue", "Sliding Window"],
            solved: 1200,
            constraints: [ "1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "1 <= k <= nums.length"],
            examples: [
                {
                    input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
                    output: "[3,3,5,5,6,7]",
                    explanation: "Window position                Max\n---------------               -----\n[1  3  -1] -3  5  3  6  7       3\n 1 [3  -1  -3] 5  3  6  7       3\n 1  3 [-1  -3  5] 3  6  7       5\n 1  3  -1 [-3  5  3] 6  7       5\n 1  3  -1  -3 [5  3  6] 7       6\n 1  3  -1  -3  5 [3  6  7]      7"
                },
                {
                    input: "nums = [1,-1], k = 1",
                    output: "[1,-1]",
                    explanation: "Each window contains exactly one number, which is its maximum."
                }
            ]
            }
];




const addproblems= async () => {

  console.log("Adding problems");

  const db = mongoose.connection;
  const collectionName = 'problems';

  if (db.collections[collectionName]) {
    try {
      await db.dropCollection(collectionName);
      console.log(`Collection '${collectionName}' dropped successfully.`);
    } catch (err) {
      console.error(`Error dropping collection: ${err.message}`);
    }
  } else {
    console.log(`Collection '${collectionName}' does not exist.`);
  }

  await Problem.insertMany(mockProblems);

  console.log("Problems inserted successfully");
  
};

module.exports = addproblems