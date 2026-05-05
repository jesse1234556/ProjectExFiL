//legend for ID.
  //(f/d) is file or directory, t is for text objective (doesnt have any objective tied to it, just info) 
  //so first objective is to upload file in phase 1, would be 1 (for upload).f.1 (for first ID).1 (for phase 1)
  //mission ID is typeOfObjetive.(f/d).IDWithinPhase.phaseCurrenetlyIn
  //type of objective legend: 1 = upload, 2 = access directory, 3 = delete file or directory, 4 = read file (cat). x = custom
  //objective code, the (f/d) could also be 't' which meants text. It still renders in order, in phase, but the 1st decimal is ignored. 
export const mission1 = {
  name: "Orientation Protocol",
  amountOfPhases: 4,

  availableCommands: {
    1: [
      "cd",
    ],
    2: [
      "cd", "ls"
    ],
    3: [
      "cd", "ls"
    ],
    4: [
      "ls", "upload"
    ]
  },

  objectives: [
    {
      text: "Type 'cd Home'",
      code: "2.d.1.1"
    },
    {
      text: "Type 'ls' to view the contents of the directory",
      code: "x.d.1.2"
    },
    {
      text: "Enter the Pictures directory",
      code: "2.d.2.2"
    },
    {
      text: "View the contents of Pictures",
      code: "x.d.1.3"
    },
    {
      text: "Go back to the Home directory",
      code: "x.d.2.3"
    },
    {
      text: "Type: 'cd ..' to move back one directory",
      code: "t.t.3.3"
    },
    {
      text: "Enter the Documents directory",
      code: "2.d.3.3"
    },
    {
      text: "Upload the image file",
      code: "1.f.1.4"
    },
    {
      text: "Type: 'upload <file name>'  Example: upload cat.png",
      code: "t.t.2.4"
    },
    {
      text: "View the contents of the Pictures directory",
      code: "x.d.3.4"
    }
  ],

  datafs: {
    user: 'Guest',
    hostname: 'ProjectExFiL',
    '/': {
      accessible: false,
      home: true,
      type: 'dir',
      children: {
        'shadow': {
          type: 'dir',
          children: {
            'secret.txt': {
              type: 'file',
              content: 'you shouldnt be able to see this, how.',
            }
          }
        },
        'Home': {
          type: 'dir',
          code: '2.d.1.1',
          customcode: 'x.d.1.2',
          children: {
            'Documents': {
              accessible: true,
              type: 'dir',
              code: '2.d.3.3',
              children: {}
            },
            'Pictures': {
              accessible: true,
              type: 'dir',
              code: '2.d.2.2',
              customcode: 'x.d.1.3',
              children: {
                'secret.png': {
                  type: 'file',
                  code: '1.f.1.4'
                }
              }
            },
            'Music': {
              accessible: false,
              type: 'dir',
              children: {}
            },
            'Videos': {
              accessible: false,
              type: 'dir',
            }
          }
        }
      }
    }
  },

  phaseDialogue1: [
    "Hello, operator.",
    "Welcome to Orientation.",
  ],
  endPhase1: [""],

  phaseDialogue2: [
    "You are inside a computer filesystem.",
    "Directories hold files and other directories.",
    "You are always in a single directory.",
    "*PAUSE*",
    "Use ls to see a list of directories in your current location,",
    "and use cd followed by a directory's name to move inside it."
  ],
  endPhase2: ["Good. You know how to go in.", "But can you find your way back out?"],

  phaseDialogue3: [
    "cd only moves you forward — into a directory.",
    "To go back, type cd ..",
    "Two dots. That's it.",
    "It moves you one directory up.",
    "*PAUSE*",
    "Try it. Go back to Home, then into Documents."
  ],
  endPhase3: ["Now you can go in and come back out.", "That's navigation."],

  phaseDialogue4: [
    "The file is in Pictures.",
    "You know how to get there now.",
    "Upload it."
  ],
  endPhase4: ["Thanks!"]
};