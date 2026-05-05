//legend for ID.
  //(f/d) is file or directory, t is for text objective (doesnt have any objective tied to it, just info) 
  //so first objective is to upload file in phase 1, would be 1 (for upload).f.1 (for first ID).1 (for phase 1)
  //mission ID is typeOfObjetive.(f/d).IDWithinPhase.phaseCurrenetlyIn
  //type of objective legend: 1 = upload, 2 = access directory, 3 = delete file or directory, 4 = read file (cat). x = custom
  //objective code, the (f/d) could also be 't' which meants text. It still renders in order, in phase, but the 1st decimal is ignored. 
export const mission2 = {
  name: "Honeypot Simulator",
  amountOfPhases: 4,

  availableCommands: {
    1: [
      "cd", "ls"
    ],
    2: [
      "cd", "ls"
    ],
    3: [
      "cd", "ls", "cat"
    ],
    4: [
      "cd", "ls", "cat", "rm"
    ]
  },

  objectives: [
    {
      text: "List the contents of the current directory",
      code: "x.d.1.1"
    },
    {
      text: "Enter the Home directory",
      code: "2.d.1.1"
    },
    {
      text: "List the contents of Home",
      code: "x.d.1.2"
    },
    {
      text: "Enter the Documents directory",
      code: "2.d.2.2"
    },
    {
      text: "Read the file inside Documents",
      code: "4.f.2.3"
    },
     {
      text: "List contents of Documents",
      code: "x.d.1.3"
    },
    {
      text: "Type: 'cat <file name>'  Example: cat notes.txt",
      code: "t.t.3.3"
    },
    {
      text: "Navigate to the Logs directory",
      code: "2.d.2.4"
    },
    {
      text: "Delete the evidence file",
      code: "3.f.3.4"
    },
    {
      text: "Type: 'rm <file name>'  Example: rm log.txt",
      code: "t.t.4.4"
    },
    {
      text: "Return back to the Home directory",
      code: "2.d.1.4",
    }
  ],

  datafs: {
    user: 'Guest',
    hostname: 'ProjectExFiL',
    '/': {
      accessible: true,
      home: true,
      type: 'dir',
      customcode: 'x.d.1.1',
      children: {
        'shadow': {
          type: 'dir',
          children: {
            'secret.txt': {
              type: 'file',
              content: 'you shouldnt be able to see this, how.',
            },
          }
        },
        'Home': {
          type: 'dir',
          code: ['2.d.1.1', "2.d.1.4"],
          customcode: 'x.d.1.2',
          children: {
            'Documents': {
              accessible: true,
              type: 'dir',
              code: '2.d.2.2',
              customcode: "x.d.1.3",
              children: {
                'mission_brief.txt': {
                  type: 'file',
                  code: '4.f.2.3',
                  content: 'Target: Delete all logs. Leave no trace.'
                }
              }
            },
            'Logs': {
              accessible: true,
              type: 'dir',
              code: '2.d.2.4',
              children: {
                'evidence.log': {
                  type: 'file',
                  code: '3.f.3.4',
                  content: 'ACCESS LOG: unauthorized entry detected at 03:42.'
                }
              }
            },
            'Pictures': {
              accessible: false,
              type: 'dir',
              children: {}
            },
            'Music': {
              accessible: false,
              type: 'dir',
              children: {}
            }
          }
        }
      }
    }
  },

  phaseDialogue1: [
    "Back again, operator.",
    "Let's see if you remember your way around."
  ],
  endPhase1: ["Good. You still know how to navigate."],

  phaseDialogue2: [
    "There's a file in the Documents directory.",
    "Read it carefully."
  ],
  endPhase2: ["You've read the brief.", "Now you know what to do."],

  phaseDialogue3: [
    "cat lets you read the contents of a file.",
    "Use it. Then we move."
  ],
  endPhase3: ["Good. Now clean up after yourself."],

  phaseDialogue4: [
    "The Logs directory has a file that can't exist.",
    "rm deletes a file permanently.",
    "Use it."
  ],
  endPhase4: ["Clean. No trace.", "Well done, operator."]
};