const terminalInput = document.getElementById('InputLine');
const terminal = document.getElementById('terminal');
const body = document.body;


const env = {
    user: 'Guest',            // username
    hostname: 'ProjectExFiL',  // optional hostname
    cwd: '/home/user',       // current working directory
    home: '/home/user',      // home directory, for ~ expansion
    // you can add more later, e.g., PATH, aliases, etc.
};

const MAX_HISTORY = 50;

let cmdhistory = [];

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

body.addEventListener('keydown', (e) => {
    if (!e.ctrlKey && !e.altKey) {
        terminalInput.focus();
    }
     if (e.key === "Tab") {
        e.preventDefault(); // ⛔ Prevent browser from switching focus
        terminalInput.focus(); // Make sure terminal input is focused
    }
});

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
    event.preventDefault(); // prevent default browser behavior (like scrolling)
console.log("hello");
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



//i dont think this is needed
function GetInputLineText() {
    // Get the full text from the terminal input
    const fullText = terminalInput.textContent;
    
    // Find the index of the last '> ' and get everything after it
    const index = fullText.lastIndexOf(' ');

    // Return the text after the '> ' 
    return fullText.substring(index + 1);
    
}

//deal with this later
terminalInput.addEventListener('paste', (e) => {
  e.preventDefault(); // Stop the default paste
  const text = (e.clipboardData || window.clipboardData).getData('text/plain');
  document.execCommand('insertText', false, text); // Insert plain text
});


// Focus input when anywhere is clicked or a keypress is detected,
// but ignore if Ctrl or Alt is held



const fs = {
    '/': {
        type: 'dir',
        children: {
            'bin': {
                type: 'dir',
                children: {
                    'ls': { type: 'file', content: 'binary for ls' },
                    'cat': { type: 'file', content: 'binary for cat' }
                }
            },
            'sbin': {
                type: 'dir',
                children: {
                    'shutdown': { type: 'file', content: 'binary for shutdown' }
                }
            },
            'etc': {
                type: 'dir',
                children: {
                    'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash' },
                    'hosts': { type: 'file', content: '127.0.0.1 localhost' }
                }
            },
            'lib': { type: 'dir', children: {} },
            'tmp': { type: 'dir', children: {} },
            'var': { type: 'dir', children: { 'log': { type: 'dir', children: {} } } },
            'usr': {
                type: 'dir',
                children: {
                    'bin': { type: 'dir', children: {} },
                    'lib': { type: 'dir', children: {} },
                    'share': { type: 'dir', children: {} }
                }
            },
            'home': {
                type: 'dir',
                children: {
                    'user': {
                        type: 'dir',
                        children: {
                            'notes.txt': { type: 'file', content: 'Helloo worldd!!' },
                            'todo.txt': { type: 'file', content: 'Buy milk\nFinish project' },
                            'readme.md': { type: 'file', content: '# Welcome to your home directory' }
                        }
                    }
                }
            }
        }
    }
};


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
            if (args.length === 0) args[0] = '/'; // default to root if no path
            const result = cd(args[0], env.cwd);   // use env.cwd
            if (result.error) printToTerminal(result.error);
            else {
                env.cwd = result.cwd;             // update env.cwd
                printToTerminal(`Directory changed to ${env.cwd}`);
                terminalPrompt.textContent = `${env.user}@${env.hostname}:${env.cwd}> `;
            }
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
    execute: () => printToTerminal('Avaliable commands: help, ' + listOfKeys)
}
let historyIndex = null; // tracks current position in history



terminalInput.addEventListener('keydown', function(e) {
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
    console.log(input);
    input.trim();
    console.log(input);
    if (input === '') return; // ignore empty commands

    printToTerminal(`${env.user}@${env.hostname}:${env.cwd}> ${input}`);

    const [cmd, ...args] = input.split(' ');

    if (commands[cmd]) {
        commands[cmd].execute(args);
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

//Old CaretAtEnd function
/*
function placeCaretAtEnd(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
}
*/
// Welcome message
printToTerminal('Welcome to the JS Terminal! Type "help" for commands.');
//show empty terminal input line
RenderLineText();
console.log(GetInputLineText());



//dialogue box stuff

const dialogueOverlay = document.getElementById("dialogueOverlay");
const dialogueBox = document.getElementById("dialogueBox");
const closeBtn = document.getElementById("closeDialogue");
const dialogueTerminal = document.getElementById("dialogueTerminal");

closeBtn.addEventListener("click", () => {
    dialogueOverlay.style.display = "none";
    dialogueBox.style.display = "none";
    dialogueTerminal.innerHTML = "";
});

function openDialogue() {
    dialogueOverlay.style.display = "block";
    dialogueBox.style.display = "block";
}

// random symbols for the decoding effect
const symbols = "!@#$%^&*()_+=-{}[]<>/?|~";
function animateLine(line, speed = 35) {
    return new Promise(resolve => {
        const lineDiv = document.createElement("div");
        dialogueTerminal.appendChild(lineDiv);

        // create scrambled version same length as real line
        let buffer = Array.from(line).map(() =>
            symbols[Math.floor(Math.random() * symbols.length)]
        );

        let index = 0;

        const interval = setInterval(() => {

            // reveal next actual character
            buffer[index] = line[index];

            // re‑scramble remaining characters
            for (let i = index + 1; i < line.length; i++) {
                buffer[i] = symbols[Math.floor(Math.random() * symbols.length)];
            }

            lineDiv.textContent = buffer.join("");

            // scroll terminal to bottom so new line appears at bottom
            dialogueTerminal.scrollTop = dialogueTerminal.scrollHeight;

            index++;

            if (index >= line.length) {
                clearInterval(interval);
                lineDiv.textContent = line; // finalize line
                dialogueTerminal.scrollTop = dialogueTerminal.scrollHeight;
                resolve();
            }

        }, speed);
    });
}


async function showDialogueLines(lines, delay = 500) {
    for (let line of lines) {
        await animateLine(line);
        await new Promise(r => setTimeout(r, delay));
    }
}

