const mongoose = require('mongoose');
const Solution = require('../models/solutionmodel');

// Added mock solutions initially

const mockSolutions = [
  {
        pid: 1,
        handlename: "tourist",
        language: "Python",
        approach: "Used a dictionary to store visited numbers and their indices. Achieves O(n) time complexity.",
        code: "def twoSum(nums, target):\n    hashmap = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hashmap:\n            return [hashmap[complement], i]\n        hashmap[num] = i",
        likes: 200
    },
    {
        pid: 1,
        handlename: "mallikarjuna",
        language: "C++",
        approach: "Using a hash map to store complement values while traversing the array once for O(n) time complexity.",
        code: "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> num_map;\n    for (int i = 0; i < nums.size(); ++i) {\n        int complement = target - nums[i];\n        if (num_map.find(complement) != num_map.end()) {\n            return {num_map[complement], i};\n        }\n        num_map[nums[i]] = i;\n    }\n    return {}; // If no solution found\n}",
        likes: 150
    },


    {
        pid: 10,
        handlename: "tourist",
        language: "C++",
        approach: "Used a min-heap (priority queue) to merge k lists efficiently. Time complexity is O(N log k).",
        code: "#include <queue>\n#include <vector>\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nstruct compare {\n    bool operator()(ListNode* a, ListNode* b) {\n        return a->val > b->val;\n    }\n};\n\nListNode* mergeKLists(vector<ListNode*>& lists) {\n    priority_queue<ListNode*, vector<ListNode*>, compare> pq;\n    for (auto l : lists) {\n        if (l) pq.push(l);\n    }\n    ListNode dummy(0), *tail = &dummy;\n    while (!pq.empty()) {\n        ListNode* node = pq.top(); pq.pop();\n        tail->next = node;\n        tail = tail->next;\n        if (node->next) pq.push(node->next);\n    }\n    return dummy.next;\n}",
        likes: 200
    },
    {
        pid: 5,
        handlename: "tourist",
        language: "Java",
        approach: "Used a stack to push opening brackets and pop for matching closing ones. Checks validity at end.",
        code: "import java.util.*;\n\npublic class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') {\n                stack.push(c);\n            } else {\n                if (stack.isEmpty()) return false;\n                char top = stack.pop();\n                if ((c == ')' && top != '(') ||\n                    (c == '}' && top != '{') ||\n                    (c == ']' && top != '[')) {\n                    return false;\n                }\n            }\n        }\n        return stack.isEmpty();\n    }\n}",
        likes: 250
    },
    {
        pid: 3,
        handlename: "tourist",
        language: "JavaScript",
        approach: "Converted number to string and compared with its reverse to check palindrome.",
        code: "function isPalindrome(x) {\n  const str = x.toString();\n  return str === str.split('').reverse().join('');\n}",
        likes: 150
    },
    {
        pid: 14,
        handlename: "mallikarjuna",
        language: "C++",
        approach: "Two-pointer after sorting to avoid duplicates and reduce complexity",
        code: "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<vector<int>> threeSum(vector<int>& nums) {\n    vector<vector<int>> result;\n    sort(nums.begin(), nums.end());\n    int n = nums.size();\n\n    for (int i = 0; i < n - 2; ++i) {\n        if (i > 0 && nums[i] == nums[i - 1]) continue; // Skip duplicate elements\n\n        int left = i + 1;\n        int right = n - 1;\n        int target = -nums[i];\n\n        while (left < right) {\n            int sum = nums[left] + nums[right];\n            if (sum == target) {\n                result.push_back({nums[i], nums[left], nums[right]});\n                ++left;\n                --right;\n\n                while (left < right && nums[left] == nums[left - 1]) ++left;\n                while (left < right && nums[right] == nums[right + 1]) --right;\n            } else if (sum < target) {\n                ++left;\n            } else {\n                --right;\n            }\n        }\n    }\n\n    return result;\n}",
        likes: 200
    }

];




const addsolutions= async () => {

  console.log("Adding solutions");

  const db = mongoose.connection;
  const collectionName = 'solutions';

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

  await Solution.insertMany(mockSolutions);

  console.log("Solutions inserted successfully");
  
};

module.exports = addsolutions