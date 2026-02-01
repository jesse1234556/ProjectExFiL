const terminalInput = document.getElementById('InputLine');
const terminal = document.getElementById('terminal');
const body = document.body;

import { mission1} from "../missions/mission1.js";

const missionData = {
    mission1,
}

let commandsrestricted = true; 
let inmission = false; 
let currentmissionphase; 

/*
//add when publishing 
window.addEventListener('beforeunload', function (e) {
    // Modern browsers ignore the custom message, but it's still required to trigger the prompt
    e.preventDefault(); // standard way to trigger the prompt
    e.returnValue = ''; // Chrome requires setting returnValue to a non-undefined value
});*/


if (window.location.pathname.endsWith("missionplay.html")) {
  inmission = true; 
} 

if (inmission == true){
  currentmissionphase = 1; 
}

const env = {
  user: 'Guest',              // username
  hostname: 'ProjectExFiL',   // optional hostname
  cwd: '/home/admin',         // current working directory
  home: '/home/admin',        // home directory, for ~ expansion
};


const MAX_HISTORY = 50;

let cmdhistory = [];const availableCommands = missionData.mission1.availableCommands;

// commands to always add
const extraCommands = ["testdialogue", "advancephase", "pwd", "whoami", "clear", "history", "date", "mainmenu"];

// iterate over each property and push the extra commands
for (const key in availableCommands) {
  if (Array.isArray(availableCommands[key])) {
    availableCommands[key].push(...extraCommands);
  }
}

function printToTerminal(text) {
    const line = document.createElement('div');
    line.className = 'line';
    line.textContent = text;
    terminal.insertBefore(line, terminalInput);
    terminal.scrollTop = terminal.scrollHeight;
}
let cursorIndex = 0;
let inputText = []; // user text array
let showCursor = true;
let cursorBlinkInterval;

function escapeHTML(text) {
    return text.replace(/[&<>"']/g, (char) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        return map[char];
    });
}

function removeLines() {
    const children = Array.from(terminal.children); // make a copy of children
    children.forEach(child => {
        if (child.classList.contains('line')) {
            terminal.removeChild(child);
        }
    });
}


function RenderLineText() {
    let renderedText = '';

    for (let i = 0; i < inputText.length; i++) {
        if (i === cursorIndex && showCursor) {
            renderedText += `<span class="highlighted">${escapeHTML(inputText[i] || ' ')}</span>`;
        } else {
            renderedText += escapeHTML(inputText[i]);
        }
    }

    // Cursor at end
    if (cursorIndex === inputText.length && showCursor) {
        renderedText += `<span class="highlighted">&nbsp;</span>`;
    }

    terminalInput.innerHTML = `${env.user}@${env.hostname}:${env.cwd}> ` + renderedText;
}


function startCursorBlink() {
    clearInterval(cursorBlinkInterval); // stop any existing interval
    showCursor = true; // make sure cursor is visible immediately
    RenderLineText();

    cursorBlinkInterval = setInterval(() => {
        showCursor = !showCursor;
        RenderLineText();
    }, 500);
}

startCursorBlink();


// Assuming terminalInput is your input container element
body.addEventListener('keydown', (event) => {
   //event.preventDefault(); // prevent default browser behavior (like scrolling) disabled for now 
   if (dialogueRunning){
    return;
   }
   switch(event.key) {
    case 'ArrowLeft':
        if (cursorIndex > 0) cursorIndex--;
        break;
    case 'ArrowRight':
        if (cursorIndex < inputText.length) cursorIndex++;
        break;
    case 'Backspace':
        if (cursorIndex > 0) {
            inputText.splice(cursorIndex - 1, 1);
            cursorIndex--;
        }
        break;
    case 'Delete':
        if (cursorIndex < inputText.length) {
            inputText.splice(cursorIndex, 1);
        }
        break;
    case 'Home':
        cursorIndex = 0;  // Move cursor to start
        break;
    case 'End':
        cursorIndex = inputText.length;  // Move cursor to end
        break;
     case '/':
            event.preventDefault(); // Prevent browser Quick Find
            inputText.splice(cursorIndex, 0, '/');
            cursorIndex++;
            break;
    default:
        // Only handle single-character keys (letters, numbers, symbols)
        if (event.key.length === 1) {
            inputText.splice(cursorIndex, 0, event.key);
            cursorIndex++;
        }
}

    startCursorBlink();
    RenderLineText(); // update the terminal display after each key
});


//deal with this later
/*
terminalInput.addEventListener('paste', (e) => {
  e.preventDefault(); // Stop the default paste
  const text = (e.clipboardData || window.clipboardData).getData('text/plain');
  document.execCommand('insertText', false, text); // Insert plain text
});
*/

// Focus input when anywhere is clicked or a keypress is detected,
// but ignore if Ctrl or Alt is held

let fs = {
  user: 'Guest',
  hostname: 'ProjectExFiL',
  '/': {
    type: 'dir',
    children: {
      'bin': {
        type: 'dir',
        children: {
          'ls': { type: 'file', content: 'ELF binary' }
        }
      },

      'etc': {
        type: 'dir',
        children: {
          'passwd': {
            type: 'file',
            content:
`root:x:0:0:root:/root:/bin/bash
user:x:1000:1000:Regular User:/home/user:/bin/bash`
          }
        }
      },

      'home': {
        type: 'dir',
        home: true,
        children: {
          'user': {
            type: 'dir',
            children: {
              'notes.txt': { type: 'file', id: 'f111', content: 'My test notes' }
            }
          }
        }
      }
    }
  }
};

function initializeEnv(fs, env) {
  // 1. Determine username
  env.user = fs.user || 'Anonymous';

  // 2. Determine hostname
  env.hostname = fs.hostname || (fs['/']?.children?.etc?.children?.hostname?.content) || 'localhost';

  // 3. Find home directory
  function findHome(dir) {
    if (dir.home === true) return dir;
    if (!dir.children) return null;
    for (const key in dir.children) {
      const res = findHome(dir.children[key]);
      if (res) return res;
    }
    return null;
  }

  const homeDir = findHome(fs['/']) || fs['/'];

  // 4. Get path string to home
  function getPathToDir(target, dir = fs['/'], path = '') {
    if (dir === target) return path || '/';
    if (!dir.children) return null;
    for (const key in dir.children) {
      const childPath = path + '/' + key;
      const res = getPathToDir(target, dir.children[key], childPath);
      if (res) return res;
    }
    return null;
  }

  env.home = getPathToDir(homeDir);
  env.cwd = env.home; // default cwd = home

  return env;
}

// Usage
initializeEnv(fs, env);
console.log(env);

//----start of simulated syscalls-----------------------------------------------------------------------------------------------------------------

function resolve(path, cwd = '/') {
  if (typeof path !== 'string') throw new Error('resolve: path must be a string');
  if (typeof cwd !== 'string') throw new Error('resolve: cwd must be a string');

  path = path.trim() || '.';
  cwd = cwd.trim() || '/';

  let start = path.startsWith('/') ? [] : cwd.split('/').filter(Boolean);
  const parts = path.split('/').filter(Boolean);

  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') start.pop();
    else start.push(part);
  }

  return '/' + start.join('/');
}

// 2️⃣ Traverse the FS object to get the node at a path
function getNode(path) {
  const parts = path.split('/').filter(Boolean);
  let node = fs['/'];
  for (const part of parts) {
    if (!node.children || !node.children[part]) return null;
    node = node.children[part];
  }
  return node;
}

// 3️⃣ List directory contents
function ls(path = '/', cwd = '/') {
  const fullPath = resolve(path, cwd);
  const node = getNode(fullPath);
  if (!node) return `ls: cannot access '${path}': No such file or directory`;
  if (node.type !== 'dir') return fullPath; // if it's a file, just return its path
  return Object.keys(node.children).join('  ') || '';
}

// 4️⃣ Change directory
function cd(path = '/', cwd = '/') {
  const fullPath = resolve(path, cwd);
  const node = getNode(fullPath);
  if (!node || node.type !== 'dir') {
    return { error: `cd: ${path}: No such directory`, cwd };
  }
  return { cwd: fullPath };
}


function readFile(path, cwd = '/') {
  const fullPath = resolve(path, cwd);
  const node = getNode(fullPath);

  if (!node) {
    return { error: `cat: ${path}: No such file or directory` };
  }
  if (node.type !== 'file') {
    return { error: `cat: ${path}: Is a directory` };
  }

  // In the future, you can check permissions here
  return { content: node.content || '' };
}

//-----end of simulated syscalls-----------------------------------------------------------------------------------------------------------------------


const commands = {
    //dev commands---------

    testdialogue: {
      description: 'Open dialogue box with animated text',
      execute: () => {
          openDialogue();
          showDialogueLines([
              "Hello, operator.",
              "I’ve been observing your activity.",
              "You opened the wrong terminal.",
              "Now your going to help me.",
              
          ]);
          }
    },
    advancephase: {
      description: 'Advance the gamePhase(complete all objectives, currently just advances dialogue phase)',
      execute: () => {
        completePhaseObjectives(objectiveTracker);
        advancePhase(); 
      }
    },
    //end of dev commands-------
        upload: {
      description: 'Upload a file to complete objectives',
      execute: (args) => {
        if (args.length < 1) {
          printToTerminal('upload: missing file operand');
          return;
        }

        // Resolve the path and get the file node
        const filePath = resolve(args[0], env.cwd);
        const fileNode = getNode(filePath);

        if (!fileNode) {
          printToTerminal(`upload: cannot find '${args[0]}'`);
          return;
        }

        if (fileNode.type !== 'file') {
          printToTerminal(`upload: '${args[0]}' is not a file`);
          return;
        }


        completeObjective(fileNode, 1, args[0])
        
      }
    },

    mv: {
        description: 'Move or rename a file/directory',
        execute: (args) => {
            if (args.length < 2) {
                printToTerminal('mv: missing file operand');
                return;

            }

            const srcPath = resolve(args[0], env.cwd);
            const destPath = resolve(args[1], env.cwd);

            // Get source node and parent
            const srcParts = srcPath.split('/').filter(Boolean);
            const srcName = srcParts.pop();
            const srcParentPath = '/' + srcParts.join('/');
            const srcParent = getNode(srcParentPath);

            if (!srcParent || !srcParent.children[srcName]) {
                printToTerminal(`mv: cannot stat '${srcPath}': No such file or directory`);
                return;
            }

            const destParts = destPath.split('/').filter(Boolean);
            const destName = destParts.pop();
            const destParentPath = '/' + destParts.join('/');
            let destParent = getNode(destParentPath);

            if (!destParent) {
                printToTerminal(`mv: cannot move to '${destPath}': No such directory`);
                return;
            }

            if (!destParent.children) destParent.children = {};

            let finalDestName = destName;
            let finalDestParent = destParent;

            // If destination exists and is a directory, move inside it
            if (destParent.children[destName] && destParent.children[destName].type === 'dir') {
                finalDestParent = destParent.children[destName];
                finalDestName = srcName;
            }

            // Check if destination file already exists
            if (finalDestParent.children[finalDestName]) {
                printToTerminal(`mv: cannot move to '${destPath}': File exists`);
                return;
            }

            // Move the node

            //handles an error that occurs sometimes when moving files to root with .. 
            if (!finalDestName) finalDestName = srcName;

            finalDestParent.children[finalDestName] = srcParent.children[srcName];
            delete srcParent.children[srcName];

            printToTerminal(`Moved '${srcPath}' to '${destPath}'`);
        }
    },

    pwd: {
    description: 'Print the current working directory',
    execute: () => {
        printToTerminal(env.cwd);
              }
         },
    whoami: {
    description: 'Display current active user',
    execute: () => {
        printToTerminal(env.user);
              }
         },
    echo: {
        description: 'Echo text back to terminal',
        execute: (args) => printToTerminal(args.join(' '))
    },
    clear: {
        description: 'Clear terminal output',
        execute: () => removeLines()
    },
   man: {
      description: 'Lists description of command',
      execute: (args) => {
          const cmd = args[0];
          if (!cmd || !commands[cmd]) {
              printToTerminal(`man: ${cmd || 'missing command'} not found`);
              return;
          }

          // Print the description
          printToTerminal(commands[cmd].description);

          // Print the usage separately
          if (usage[cmd]) {
              printToTerminal(`Usage: ${usage[cmd]}`);
          }
      }
     }
,
    mkdir: {
    description: 'Create a new directory',
    execute: (args) => {
        if (args.length === 0) {
            printToTerminal('mkdir: missing operand');
            return;
        }

        const path = args[0];
        const fullPath = resolve(path, env.cwd);
        const parts = fullPath.split('/').filter(Boolean);

        let node = fs['/']; // start at root
        try {
            for (const part of parts) {
                if (!node.children) node.children = {};

                // If a file exists where we want a directory
                if (node.children[part] && node.children[part].type !== 'dir') {
                    throw new Error(`mkdir: cannot create directory '${fullPath}': File exists`);
                }

                // Create directory if it doesn't exist
                if (!node.children[part]) {
                    node.children[part] = { type: 'dir', children: {} };
                }

                node = node.children[part]; // descend into directory
            }

            printToTerminal(`Directory created: ${fullPath}`);
        } catch (err) {
            printToTerminal(err.message);
              }
          }
      },

            cd: {
        description: 'Change the current directory',
        execute: (args) => {
            if (args.length === 0) args[0] = '/';

            const result = cd(args[0], env.cwd);

            if (result.error) {
            printToTerminal(result.error);
            return;
            }

            // Update cwd
            env.cwd = result.cwd;
            printToTerminal(`Directory changed to ${env.cwd}`);

            // ---- OBJECTIVE CHECK
            const dirNode = getNode(env.cwd);
            completeObjective(dirNode, 2, args[0])
             }
        },

    ls: {
        description: 'List directory contents',
        execute: (args) => {
            const path = args[0] || '.';
            const output = ls(path, env.cwd);     // use env.cwd
            printToTerminal(output);
        }
    },
    cat: {
  description: 'Display file contents',
  execute: (args) => {
    if (args.length === 0) {
      printToTerminal('cat: missing file operand');
      return;
    }

    for (const path of args) {
      const result = readFile(path, env.cwd);
      if (result.error) {
        printToTerminal(result.error);
      } else {
        printToTerminal(result.content);
      }
       }

      const filePath = resolve(args[0], env.cwd);
       const fileNode = getNode(filePath);
       completeObjective(fileNode, 4, args[0]);

     }
   },
   history: {
      description: 'Display last 50 commands ran',
      execute: () => {
        // Show the last 50 commands (or fewer if less exist)
        const start = Math.max(cmdhistory.length - 50, 0);
        const recentCommands = cmdhistory.slice(start);

        if (recentCommands.length === 0) {
            printToTerminal('No commands in history.');
            return;
        }

        // Print each command with its number
        recentCommands.forEach((cmd, index) => {
            printToTerminal(`${start + index + 1}: ${cmd}`);
        });

      }
   },
   touch: {
    description: 'Create a new empty file',
    execute: (args) => {
        if (args.length === 0) {
            printToTerminal('touch: missing file operand');
            return;
        }

        const path = args[0];
        const fullPath = resolve(path, env.cwd);
        const parts = fullPath.split('/').filter(Boolean);
        const fileName = parts.pop(); // last part is the file

        // Get the parent directory
        const parentPath = '/' + parts.join('/');
        const parentNode = getNode(parentPath);

        if (!parentNode) {
            printToTerminal(`touch: cannot create file '${fullPath}': No such directory`);
            return;
        }

        if (!parentNode.children) parentNode.children = {};

        if (parentNode.children[fileName]) {
            if (parentNode.children[fileName].type === 'dir') {
                printToTerminal(`touch: cannot create file '${fullPath}': Is a directory`);
                return;
            } else {
                printToTerminal(`File already exists: ${fullPath}`);
                return;
            }
        }

        // Create the new file
        parentNode.children[fileName] = { type: 'file', content: '' };
        printToTerminal(`File created: ${fullPath}`);
          }
      },
      date: {
    description: 'Print the current date and time',
    execute: () => {
        const now = new Date();
        printToTerminal(now.toString());
        }
    },
   cp: {
    description: 'Copy a file or directory',
    execute: (args) => {
        if (args.length < 2) {
            printToTerminal('cp: missing file operand');
            return;
        }

        // Handle flags
        let recursive = false;
        if (args[0].startsWith('-')) {
            const flags = args.shift();
            if (flags.includes('r')) recursive = true;
            else {
                printToTerminal(`cp: invalid option '${flags}'`);
                return;
            }
        }

        const srcPath = resolve(args[0], env.cwd);
        const destPath = resolve(args[1], env.cwd);

        // Get source node and parent
        const srcParts = srcPath.split('/').filter(Boolean);
        const srcName = srcParts.pop();
        const srcParentPath = '/' + srcParts.join('/');
        const srcParent = getNode(srcParentPath);

        if (!srcParent || !srcParent.children[srcName]) {
            printToTerminal(`cp: cannot stat '${srcPath}': No such file or directory`);
            return;
        }

        const srcNode = srcParent.children[srcName];

        // If source is a directory and not recursive, error
        if (srcNode.type === 'dir' && !recursive) {
            printToTerminal(`cp: -r not specified; omitting directory '${srcPath}'`);
            return;
        }

        // Resolve destination
        const destParts = destPath.split('/').filter(Boolean);
        const destName = destParts.pop();
        const destParentPath = '/' + destParts.join('/');
        let destParent = getNode(destParentPath);

        if (!destParent) {
            printToTerminal(`cp: cannot copy to '${destPath}': No such directory`);
            return;
        }

        if (!destParent.children) destParent.children = {};

        let finalDestName = destName;
        let finalDestParent = destParent;

        // If destination exists and is a directory, copy inside it
        if (destParent.children[destName] && destParent.children[destName].type === 'dir') {
            finalDestParent = destParent.children[destName];
            finalDestName = srcName;
        }

        // Recursive copy function
        const copyNode = (node) => {
            if (node.type === 'file') {
                return { type: 'file', content: node.content };
            } else if (node.type === 'dir') {
                const newDir = { type: 'dir', children: {} };
                for (const key in node.children) {
                    newDir.children[key] = copyNode(node.children[key]);
                }
                return newDir;
            }
        };

        // Check if destination already exists
        if (finalDestParent.children[finalDestName]) {
            printToTerminal(`cp: cannot copy to '${destPath}': File exists`);
            return;
        }

        // Perform copy
        finalDestParent.children[finalDestName] = copyNode(srcNode);
        printToTerminal(`Copied '${srcPath}' to '${destPath}'`);
    }
},

mainmenu: {
    description: "Return to Main Menu",
    execute: (args) => {
        console.log('args:', args); // already shows ['-f']
        const flag = args[0];
        if (flag === "-f") {
            printToTerminal("Redirecting to index.html...");
             window.location.href = 'index.html';
        } else {
            printToTerminal("Are you sure? Run 'mainmenu -f' to confirm.");
        }
    }
},


grep: {
    description: 'Search for a pattern in files or directories',
    execute: (args) => {
        if (args.length < 2) {
            printToTerminal('grep: missing operand');
            printToTerminal('Usage: grep [-r] <pattern> <file|dir> ...');
            return;
        }

        let recursive = false;

        // Handle flags
        while (args[0].startsWith('-')) {
            const flags = args.shift();
            if (flags.includes('r')) recursive = true;
            else {
                printToTerminal(`grep: invalid option '${flags}'`);
                return;
            }
        }

        if (args.length < 2) {
            printToTerminal('grep: missing operand after flags');
            return;
        }

        const pattern = args[0];
        const targets = args.slice(1);

        // Recursive search function for files
        const searchNode = (node, currentPath) => {
            const results = [];

            if (node.type === 'file') {
                const lines = (node.content || '').split('\n');
                lines.forEach(line => {
                    if (line.includes(pattern)) {
                        results.push(`${currentPath}: ${line}`);
                    }
                });
            } else if (node.type === 'dir' && recursive) {
                for (const key in node.children) {
                    results.push(...searchNode(node.children[key], currentPath + '/' + key));
                }
            }

            return results;
        };

        // Iterate over all targets
        let allResults = [];
        targets.forEach(target => {
            const fullPath = resolve(target, env.cwd);
            const node = getNode(fullPath);
            if (!node) {
                printToTerminal(`grep: ${target}: No such file or directory`);
                return;
            }
            allResults.push(...searchNode(node, fullPath === '/' ? '' : fullPath));
        });

        // Print results
        if (allResults.length === 0) {
            printToTerminal(''); // no matches
        } else {
            allResults.forEach(line => printToTerminal(line));
        }
    }
},

rm: {
    description: 'Remove a file or directory',
    execute: (args) => {
        if (args.length === 0) {
            printToTerminal('rm: missing operand');
            return;
        }

        // Handle flags
        let recursive = false;
        if (args[0].startsWith('-')) {
            const flags = args.shift();
            if (flags.includes('r')) recursive = true;
            else {
                printToTerminal(`rm: invalid option '${flags}'`);
                return;
            }
        }

        const path = resolve(args[0], env.cwd);

        // Prevent deleting the current working directory or its parents
        if (env.cwd === path || env.cwd.startsWith(path + '/')) {
            printToTerminal(`rm: cannot remove '${path}': current directory or parent directory`);
            return;
        }

        // Get node and parent
        const parts = path.split('/').filter(Boolean);
        const name = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parentNode = getNode(parentPath);

        if (!parentNode || !parentNode.children[name]) {
            printToTerminal(`rm: cannot remove '${path}': No such file or directory`);
            return;
        }

        const node = parentNode.children[name];

        // Handle directories
        if (node.type === 'dir') {
            if (!recursive) {
                printToTerminal(`rm: cannot remove '${path}': Is a directory`);
                return;
            }
        }

        // Recursive delete function
        const deleteNode = (n) => {
            if (n.type === 'dir') {
                for (const key in n.children) {
                    deleteNode(n.children[key]);
                }
            }
            // Node will be removed by parent after recursion
        };

        if (node.type === 'dir') deleteNode(node);

        // Delete from parent
        delete parentNode.children[name];
        printToTerminal(`Removed '${path}'`);
    }
},
};



const usage = {
  upload: "upload <file>",
  mainmenu: "mainmenu [-f]",
  grep: 'grep [-r] <pattern> <file|dir> ...',
  rm: 'rm [-r] <file>',
  cp: 'cp [-r] <source> <destination>',
  date: 'date',
  whoami: 'whoami',
  mv: 'mv <source> <destination>',
  pwd: 'pwd',
  help: 'help',
  echo: 'echo <text>',
  clear: 'clear',
  man: 'man <command>',
  mkdir: 'mkdir <directory>',
  cd: 'cd <directory>',
  ls: 'ls [directory]',
  cat: 'cat <file> [file...]',
  history: 'history',
  touch: 'touch <file>',
};

const listOfKeys = Object.keys(commands).join(", ")

//help command outside of commands object because cant print listofKeys since it doesnt exist before getting defined
commands.help = {
    description: 'Show available commands', 
    execute: () => printToTerminal('Available commands: help, ' + availableCommands[currentmissionphase].join(', '))
}
let historyIndex = null; // tracks current position in history


//input handling
body.addEventListener('keydown', function(e) {
 if (e.key === 'Tab') {
    e.preventDefault(); // Prevent browser tabbing

    const input = inputText.join('').trim();

    // Split input into command and arguments
    let parts = input.split(' ');
    let lastPart = parts.pop() || '';
    const isFirstWord = parts.length === 0; // true if editing the command

    let suggestions = [];

    if (isFirstWord) {
        // Complete commands
        suggestions = Object.keys(commands).filter(cmd => cmd.startsWith(lastPart));
    } else {
        // Complete files/directories
        let basePath = '';
        let partial = lastPart;
        if (lastPart.includes('/')) {
            const idx = lastPart.lastIndexOf('/');
            basePath = lastPart.slice(0, idx + 1); // keep trailing slash
            partial = lastPart.slice(idx + 1);
        }

        const cwdPath = resolve(basePath, env.cwd);
        const node = getNode(cwdPath);
        if (!node || node.type !== 'dir') return; // nothing to autocomplete

        suggestions = Object.keys(node.children).filter(name => name.startsWith(partial));
        suggestions = suggestions.map(name => basePath + name); // add basePath prefix
    }

    if (suggestions.length === 0) return;

   if (suggestions.length === 1) {
    // Single match: complete it
    let completion = suggestions[0];

    if (!isFirstWord) {
        const node = getNode(resolve(completion, env.cwd));
        if (node?.type === 'dir') {
            completion += '/'; // keep slash for directories
        } else {
            completion += ' '; // add space after file
        }
    }

    parts.push(completion);

    // Update inputText correctly with spaces
    inputText = parts.join(' ').split('');
    cursorIndex = inputText.length;
    RenderLineText();
}

else {
        // Multiple matches: complete to longest common prefix
        let prefix = lastPart;
        for (let i = 0; ; i++) {
            const char = suggestions[0][i + lastPart.length];
            if (!char || suggestions.some(s => s[i + lastPart.length] !== char)) break;
            prefix += char;
        }
        parts.push(prefix);

        // Show all possibilities if already at longest common prefix
        if (input === parts.join(' ')) {
            printToTerminal(`${env.user}@${env.hostname}:${env.cwd}> ${input}`);
            printToTerminal(suggestions.join('  '));
        }
    }

    // Update inputText array and cursor
    inputText = parts.join(' ')?.split('') || [];
    cursorIndex = inputText.length;
    RenderLineText();
}

   if (e.key === 'ArrowUp') {
    if (cmdhistory.length === 0) return;

    if (historyIndex === null) {
        historyIndex = cmdhistory.length - 1;
    } else if (historyIndex > 0) {
        historyIndex--;
    }

    // Update inputText to the command from history
    inputText = cmdhistory[historyIndex].split(''); // convert string to array of chars
    cursorIndex = inputText.length; // place cursor at end
    RenderLineText();
    e.preventDefault();
}

if (e.key === 'ArrowDown') {
    if (historyIndex === null) return;

    if (historyIndex < cmdhistory.length - 1) {
        historyIndex++;
        inputText = cmdhistory[historyIndex].split('');
    } else {
        historyIndex = null;
        inputText = [];
    }
    cursorIndex = inputText.length; // place cursor at end
    RenderLineText();
    e.preventDefault();
}
if (e.key === 'Enter') {
    e.preventDefault(); 

    const input = inputText.join('').trim().replace(/\s+/g, ' '); // join array into string and trim
    input.trim();
    if (input === '') return; // ignore empty commands

    printToTerminal(`${env.user}@${env.hostname}:${env.cwd}> ${input}`);

    const [cmd, ...args] = input.split(' ');

    if (commands[cmd]) {
        let commandAvailable = false;
        for (let i = 0; i < availableCommands[currentmissionphase].length; i++){
            if (cmd == availableCommands[currentmissionphase][i]) {
                commandAvailable = true
            }
        }
        if (commandAvailable || !commandsrestricted){
        commands[cmd].execute(args);
        } else {
            printToTerminal("Command not available: " + input)
        }
    } else {
        printToTerminal('Unknown command: ' + input);
    }

    historyIndex = null; // reset history pointer

    // Save to history if not empty and not duplicate of last
    if (input !== '' && input !== cmdhistory[cmdhistory.length - 1]) {
        cmdhistory.push(input);
    }

    // Trim history if exceeds max
    if (cmdhistory.length > MAX_HISTORY) {
        cmdhistory.shift();
    }

    // Reset inputText and cursor
    inputText = [];
    cursorIndex = 0;
    RenderLineText(); // update terminal display
}


})

// Welcome message
printToTerminal('Welcome to the JS Terminal! Type "help" for commands.');
//show empty terminal input line
RenderLineText();




//dialogue box stuff

const DIALOGUE_COMMANDS = {
    PAUSE: "*PAUSE*",
    END: "*END*"
};


const darkoverlay = document.getElementById("darkoverlay");
const dialogueOverlay = document.getElementById("dialogueOverlay");
const dialogueBox = document.getElementById("dialogueBox");
const closeBtn = document.getElementById("closeDialogue");
const dialogueTerminal = document.getElementById("dialogueTerminal");
const continueButton = document.getElementById("continuebuttondialogue")

continueButton.style.userSelect = "none";

let dialogueSession = 0;

let canContinue = false;
let isEndOfDialogue = false; 
/*
if (canContinue) {
  continueButton.style.display = "flex";
  if (isEndOfDialogue) {
    continueButton.innerHTML = "Close";
  }
} else {continueButton.style.display = "none";}
*/ //only runs once dumbie, must be in a loop or event
function closeDialogue(){
    dialogueSession++;
    dialogueOverlay.style.display = "none";
    dialogueBox.style.display = "none";
    dialogueTerminal.innerHTML = "";
    darkoverlay.style.display = "none";
    canContinue = false;
    isEndOfDialogue = false;
    dialogueRunning = false;
}

closeBtn.addEventListener("click", () => {
    closeDialogue();
});


document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialogueRunning) {
        closeDialogue();
    }
});

function openDialogue() {
    dialogueSession++;
    dialogueOverlay.style.display = "block";
    darkoverlay.style.display = "block"
    dialogueBox.style.display = "block";
    canContinue = false;
}

// random symbols for the decoding effect
const symbols = "!@#$%^&*()_+=-{}[]<>/?|~";
function animateLine(line, speed = 35, sessionId) {
    return new Promise(resolve => {
        const lineDiv = document.createElement("div");
        dialogueTerminal.appendChild(lineDiv);

        let buffer = Array.from(line).map(() =>
            symbols[Math.floor(Math.random() * symbols.length)]
        );

        let index = 0;

        const interval = setInterval(() => {

            // CANCEL CHECK
            if (sessionId !== dialogueSession) {
                clearInterval(interval);
                resolve();
                return;
            }

            buffer[index] = line[index];

            for (let i = index + 1; i < line.length; i++) {
                buffer[i] = symbols[Math.floor(Math.random() * symbols.length)];
            }

            lineDiv.textContent = buffer.join("");
            dialogueTerminal.scrollTop = dialogueTerminal.scrollHeight;

            index++;

            if (index >= line.length) {
                clearInterval(interval);
                lineDiv.textContent = line;
                resolve();
            }

        }, speed);
    });
}

let dialogueRunning = false; // global or module-level flag

async function showDialogueLines(lines, delay = 350) {
      if (dialogueRunning) return; // prevent overlapping dialogues
    dialogueRunning = true;

    openDialogue();
    const sessionId = dialogueSession;

    continueButton.style.display = "none";

    for (let i = 0; i < lines.length; i++) {

        if (sessionId !== dialogueSession) return;

        const line = lines[i];

        // ---- PAUSE COMMAND ----
        if (line === DIALOGUE_COMMANDS.PAUSE) {
            continueButton.textContent = "Continue";
            continueButton.style.display = "flex";

            await waitForContinue(sessionId);

            continueButton.style.display = "none";
            continue;
        }

        // ---- END COMMAND ----
        if (line === DIALOGUE_COMMANDS.END) {
            continueButton.textContent = "Close";
            continueButton.style.display = "flex";

            await waitForContinue(sessionId);
            closeDialogue();
            return;
        }

        // ---- NORMAL LINE ----
        await animateLine(line, 35, sessionId);

// wait ONLY if the next entry is a normal line
const next = lines[i + 1];
if (next && !Object.values(DIALOGUE_COMMANDS).includes(next)) {
    await new Promise(r => setTimeout(r, delay));
}

    }

    // fallback end if no *END* token
    continueButton.textContent = "Close";
    continueButton.style.display = "flex";
    await waitForContinue(sessionId);
closeDialogue();
}

function waitForContinue(sessionId) {
    return new Promise(resolve => {

        function handler() {
            continueButton.removeEventListener("click", handler);
            resolve();
        }

        continueButton.addEventListener("click", handler);

        // auto-resolve if dialogue is closed mid-wait
        const check = setInterval(() => {
            if (sessionId !== dialogueSession) {
                clearInterval(check);
                continueButton.removeEventListener("click", handler);
                resolve();
            }
        }, 50);
    });
}


  //function takes ShowDialogueLines and gives it the current dialogue meant to be shown. 
 

  //stuff for mission

 let missionnumber = 1;

  if (inmission){

  const params = new URLSearchParams(window.location.search);
  const requestedMission = parseInt(params.get("mission"), 10);
  console.log(requestedMission);
  const highestCompleted = GameSave.state.highestMission;
if (
  Number.isNaN(requestedMission) ||   // not a number
  requestedMission <= 0 ||             // negative or zero
  requestedMission >= 7                // 7 or higher
) {
  window.location.href = "missionselect.html";
} else {
  missionnumber = requestedMission;
  console.log(requestedMission);
}


  }

document.getElementById("replayinfo").addEventListener("click", function() {
    DisplayCurrentDialogue();
});




let missionKey = `mission${missionnumber}`;
let phaseKey = `phaseDialogue${currentmissionphase}`;

  function DisplayCurrentDialogue() { 
    phaseKey =`phaseDialogue${currentmissionphase}`;

    // Get the dialogue for the current mission and phase
    const dialogueLines = missionData[missionKey][phaseKey];
    console.log(missionData[missionKey][phaseKey])
    // Safety check in case the mission or phase doesn't exist
    if (dialogueLines && dialogueLines.length > 0) {
        showDialogueLines(dialogueLines);
    } else {
        console.warn(`No dialogue found for ${missionKey} phase ${currentmissionphase}`);
    }
}
function EndOfPhaseDialogue() { 
    const endPhaseKey = `endPhase${currentmissionphase - 1}`;
    const nextPhaseKey = `phaseDialogue${currentmissionphase}`;

    // Get the end-of-phase and next-phase dialogue lines
    const endPhaseLines = missionData[missionKey][endPhaseKey] || [];
    const nextPhaseLines = missionData[missionKey][nextPhaseKey] || [];

    if (endPhaseLines.length === 0 && nextPhaseLines.length === 0) {
        console.warn(`No dialogue found for ${missionKey} end of phase ${currentmissionphase - 1} or phase ${currentmissionphase}`);
        return;
    }

    // Combine dialogues: end phase, pause, then next phase
    const combinedDialogue = [...endPhaseLines, "*PAUSE*", ...nextPhaseLines];

    // Display the combined dialogue
    showDialogueLines(combinedDialogue);
}


  let objectiveTracker = [] //objective tracker is copy of 'objectives' from the current selected mission

//initalize the current mission using missionData aswell as missionumber
function initializeMission(){

 fs = { ...missionData[missionKey].datafs };


  const objectives = missionData[missionKey].objectives;
  objectiveTracker = objectives;
  
}

const objectivecontent = document.getElementById("objectivecontent"); 

function completeObjective(node, i, name) {
    // name is the name of the node
    // node is the file system node getting sent to test for completion
    // i is the type of objective trying to get completed 
    // code for 'i': 1 = upload, 2 = access dir, 3 = file deleted/not exist 
    if (!node.code) return;

// Get phase from 4th digit of code
const nodePhase = parseInt(node.code.split(".")[3]) || 0;

// Only allow completion if it matches current mission phase
if (nodePhase !== currentmissionphase) return;


    switch (i) {
        case 1: {
            if (!node.code) {
                console.log("Upload failed: Node does not have a code");
                printToTerminal("Upload failed");
                return;
            }

            // Find matching objective by code
            const objectiveIndex = objectiveTracker.findIndex(obj => obj.code === node.code);

            if (objectiveIndex === -1) {
                console.log(`Upload failed: No objective found with code '${node.code}'`);
                printToTerminal("Upload failed,");
                return;
            }

            const objective = objectiveTracker[objectiveIndex];

            if (objective.status === 'completed') {
                console.log(`Upload failed: Objective '${name}' is already completed`);
                printToTerminal(`upload: '${name}' already uploaded`);
                return;
            }

            // Mark objective as completed
            objective.status = 'completed';
            updateObjectives();

            // Inform the user
            printToTerminal(`Upload of '${name}' successful`);
            break;
        }
        case 2: {
            console.log("HELLOOO");

            if (!node.code) {
                return;
            }


            const objectiveIndex = objectiveTracker.findIndex(obj => obj.code === node.code);

            if (objectiveIndex === -1) {
                console.log(`Access directory failed: No objective found with code '${node.code}'`);
                return;
            }

            const objective = objectiveTracker[objectiveIndex];

            if (objective.status === 'completed') {
                return;
            }

            // Mark objective as completed
            objective.status = 'completed';
            updateObjectives();
            printToTerminal(`Objective completed by entering '${name}'`);
        }
    case 4: {
         if (!node || !node.code) {
                return;
            }



         const objectiveIndex = objectiveTracker.findIndex(obj => obj.code === node.code);

          if (objectiveIndex === -1) {
                console.log(`Access directory failed: No objective found with code '${node.code}'`);
                return;
            }

             const objective = objectiveTracker[objectiveIndex]

          if (objective.status === 'completed') {
                 return;
            }

             objective.status = 'completed';
            updateObjectives();
            printToTerminal(`Objective completed by reading '${name}'`);
    }
    }
}
function completePhaseObjectives(obj) {
  // obj is objectiveTracker or its elements
  if (!obj) return;

  if (Array.isArray(obj)) {
    // If it's an array, loop through each item
    obj.forEach(item => completePhaseObjectives(item));
  } else if (typeof obj === "object") {
    // If it's an object, check if it has a code
    if (obj.code) {
      const parts = obj.code.split(".");
      const phase = parseInt(parts[3]) || 0; // 4th number is phase
      if (phase === currentmissionphase) {
        obj.status = "completed";
      }
    }

    // Recursively check all keys in case there are nested objects
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
        completePhaseObjectives(obj[key]);
      }
    }
  }
}


function updateObjectives() {
  // Clear current content
  objectivecontent.innerHTML = "";

  // Sort objectives by the 3rd unit in the code
  const sortedObjectives = [...objectiveTracker]
    .sort((a, b) => {
      const aParts = a.code.split(".");
      const bParts = b.code.split(".");

      const aThird = parseInt(aParts[2]) || Infinity;
      const bThird = parseInt(bParts[2]) || Infinity;

      return aThird - bThird;
    })
    // Only include objectives that match the current mission phase
    .filter(obj => {
      const parts = obj.code.split(".");
      const phase = parseInt(parts[3]) || 0; // 4th number (index 3)
      return phase === currentmissionphase;
    });

  // Loop through each sorted & filtered objective
  sortedObjectives.forEach((obj, index) => {
    const span = document.createElement("span");
    span.id = index + 1; // Optional: unique id

    if (obj.status === "completed") {
      span.style.textDecoration = "line-through";
      span.textContent = "☑ " + obj.text;
    } else {
      span.textContent = "☐ " + obj.text;
    }

    objectivecontent.appendChild(span);
    objectivecontent.appendChild(document.createElement("br"));
  });

  checkPhaseCompletion();
}

function checkPhaseCompletion() {
    
  const currentPhaseObjectives = objectiveTracker.filter(obj => {
    const phase = parseInt(obj.code.split(".")[3]) || 0;
    return phase === currentmissionphase;
  });

  // If there are no objectives for this phase, do nothing
  if (currentPhaseObjectives.length === 0) return;

  // Check if all current phase objectives are completed
  const allCompleted = currentPhaseObjectives.every(obj => obj.status === "completed");

  if (allCompleted) {
    advancePhase();
  }
}




function renderAvailableCommands(currentmissionphase, availableCommands) {
  const commandcolumn = document.getElementById("commandcolumn");
  if (!commandcolumn) return;

  // Clear previous commands
  commandcolumn.innerHTML = "";

  // Get commands for the current phase
  const commands = availableCommands[currentmissionphase] || [];

  // Render each command separated by <br>
  commands.forEach(cmd => {
    const span = document.createElement("span");
    span.textContent = cmd;
    commandcolumn.appendChild(span);
    commandcolumn.appendChild(document.createElement("br"));
  });
}


function advancePhase() {
    currentmissionphase++;
    phaseKey =`phaseDialogue${currentmissionphase}`; 
    EndOfPhaseDialogue();
    updateObjectives();
    renderAvailableCommands(currentmissionphase, availableCommands);
}

if (inmission){
  initializeMission()
  DisplayCurrentDialogue();
  updateObjectives();
  renderAvailableCommands(currentmissionphase, availableCommands);
}

function checkObjectiveCodeConsistency(objectiveTracker, filesystem) {
  // 1. Collect all codes from objectiveTracker
  const trackerCodes = new Set(objectiveTracker.map(obj => obj.code));

  // 2. Recursively collect all codes from filesystem nodes
  const filesystemCodes = new Set();

  function collectCodes(obj) {
    if (!obj || typeof obj !== "object") return;

    if (obj.code) {
      filesystemCodes.add(obj.code);
    }

    // Recursively check nested objects
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
        collectCodes(obj[key]);
      }
    }
  }

  collectCodes(filesystem);

  // 3. Check for codes in tracker not in filesystem
  trackerCodes.forEach(code => {
    if (!filesystemCodes.has(code)) {
      console.warn(`WARNING: ObjectiveTracker code '${code}' has no matching filesystem node.`);
    }
  });

  // 4. Check for codes in filesystem not in tracker
  filesystemCodes.forEach(code => {
    if (!trackerCodes.has(code)) {
      console.warn(`WARNING: Filesystem node code '${code}' has no matching objective in ObjectiveTracker.`);
    }
  });
}

checkObjectiveCodeConsistency(objectiveTracker, fs);