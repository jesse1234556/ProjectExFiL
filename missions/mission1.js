export const mission1 = {
  name: "Orientation Protocol",
  amountOfPhases: 6,

  availableCommands: {
    1: ["cd"],
    2: ["cd", "ls"],
    3: ["cd", "ls"],
    4: ["cd", "ls"],
    5: ["cd", "ls"],
    6: ["cd", "ls", "upload"]
  },

  objectives: [
    // Phase 1 - just cd Home
    {
      text: "Type 'cd Home' to enter the Home directory",
      code: "2.d.1.1"
    },

    // Phase 2 - introduce ls
    {
      text: "Type 'ls' to see what's inside Home",
      code: "x.d.1.2"
    },
    {
      text: "Enter the Pictures directory",
      code: "2.d.2.2"
    },

    // Phase 3 - introduce cd ..
    {
      text: "Type 'cd ..' to go back to Home",
      code: "t.t.1.3"
    },
    {
      text: "Go back to the Home directory",
      code: "2.d.1.3"
    },
    {
      text: "List the contents of Home",
      code: "x.d.2.3"
    },

    // Phase 4 - drill cd and ls together
    {
      text: "Enter the Music directory",
      code: "2.d.1.4"
    },
    {
      text: "List the contents of Music",
      code: "x.d.2.4"
    },
    {
      text: "Go back to Home",
      code: "2.d.3.4"
    },
    {
      text: "Enter the Documents directory",
      code: "2.d.4.4"
    },
    {
      text: "List the contents of Documents",
      code: "x.d.5.4"
    },

    // Phase 5 - find the file
    {
      text: "Enter the Pictures directory",
      code: "2.d.1.5"
    },
    {
      text: "List the contents of Pictures",
      code: "x.d.2.5"
    },

    // Phase 6 - upload
    {
      text: "List the contents of Pictures",
      code: "x.d.1.6"
    },
    {
      text: "Type: 'upload <file name>'",
      code: "t.t.2.6"
    },
    {
      text: "Example: upload secret.png",
      code: "t.t.3.6"
    },
    {
      text: "Upload the file",
      code: "1.f.4.6"
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
          code: ['2.d.1.1', '2.d.1.3', '2.d.3.4',],
          customcode: ['x.d.1.2', 'x.d.2.3'],
          children: {
            'Documents': {
              accessible: true,
              type: 'dir',
              code: '2.d.4.4',
              customcode: 'x.d.5.4',
              children: {}
            },
            'Pictures': {
              accessible: true,
              type: 'dir',
              code: ['2.d.2.2', '2.d.1.5'],
              customcode: ['x.d.2.5', 'x.d.1.6'],
              children: {
                'secret.png': {
                  type: 'file',
                  code: '1.f.4.6'
                }
              }
            },
            'Music': {
              accessible: true,
              type: 'dir',
              code: '2.d.1.4',
              customcode: 'x.d.2.4',
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
    "You are inside a filesystem.",
    "Type 'cd Home' to begin."
  ],
  endPhase1: ["Good."],

  phaseDialogue2: [
    "ls shows you what's in your current directory.",
    "cd moves you into one."
  ],
  endPhase2: ["You can move and look.", "Let's go deeper."],

  phaseDialogue3: [
    "cd .. moves you back one directory.",
    "Try it."
  ],
  endPhase3: ["In, out.", "You've got it."],

  phaseDialogue4: [
    "Drill it.",
    "Navigate every directory. Look inside each one."
  ],
  endPhase4: ["That's navigation.", "Now use it."],

  phaseDialogue5: [
    "There's a file in this filesystem.",
    "Find it."
  ],
  endPhase5: ["There it is.", "Now get it out."],

  phaseDialogue6: [
    "upload sends a file out.",
    "You know where it is."
  ],
  endPhase6: [
    "That's the job.",
    "Orientation complete."
  ]
};