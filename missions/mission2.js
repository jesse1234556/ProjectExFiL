//legend for ID.
  //(f/d) is file or directory
  //so first objective is to upload file in phase 1, would be 1 (for upload).f.1 (for first ID).1 (for phase 1)
  //mission ID is typeOfObjetive.(f/d).IDWithinPhase.phaseCurrenetlyIn
  //type of objective legend: 1 = upload, 2 = access directory, 3 = delete file or directory, 4 = read file (cat).
 export const mission2 = {
  name: "Honeypot Simulator",

  amountOfPhases: 0,

  // available commands per phase
  availableCommands: {
    1: [
      "cd", "pwd", "ls", "upload"
    ],
    2: [
      "cd", "ls", "pwd", "upload"
    ],
    3: [
      "cd", "ls", "pwd", "upload"
    ],
    // add more phases if needed
  },

  // objectives list
  objectives: [
    {
      text: "",
      code: ""
    },
    {
      text: "",
      code: ""
    },
    {
      text: "",
      code: ""
    },
    {
      text: "",
      code: ""
    },
    {
      text: "",
      code: ""
    }
  ],

  // virtual filesystem
  datafs: {
    user: '',
    hostname: '',

    '/': {
      accessible: false,
      home: true,
      type: 'dir',

      children: {
        'Folder': {
          type: 'dir',
          accessible: true,
          code: '',
          customcode: '',

          children: {
            'SubFolder': {
              type: 'dir',
              accessible: true,
              code: '',
              customcode: '',

              children: {

              }
            },

            'file.txt': {
              type: 'file',
              content: '',
              code: '',
              customcode: ''
            }
          }
        },

        'AnotherFolder': {
          type: 'dir',
          accessible: false,

          children: {

          }
        }
      }
    }
  },

  // PHASE DIALOGUE

  phaseDialogue1: [
    "",
    ""
  ],

  endPhase1: [
    ""
  ],

  phaseDialogue2: [
    "",
    ""
  ],

  endPhase2: [
    ""
  ],

  phaseDialogue3: [
    "",
    ""
  ],

  endPhase3: [
    ""
  ],

  // extend if needed
  // phaseDialogue4: [],
  // endPhase4: []
};