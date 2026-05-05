//legend for ID.
  //(f/d) is file or directory
  //so first objective is to upload file in phase 1, would be 1 (for upload).f.1 (for first ID).1 (for phase 1)
  //mission ID is typeOfObjetive.(f/d).IDWithinPhase.phaseCurrenetlyIn
  //type of objective legend: 1 = upload, 2 = access directory, 3 = delete file or directory, 4 = read file (cat).
 export const mission4 = {
  name: "Apartment Complex",
  amountOfPhases: 5,

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
    ],
    5: [
      "cd", "ls", "cat", "rm", "upload"
    ]
  },

  objectives: [
    {
      text: "List the contents of the current directory",
      code: "x.d.1.1"
    },
    {
      text: "Enter the Complex directory",
      code: "2.d.1.1"
    },
    {
      text: "List the contents of the Complex",
      code: "x.d.1.2"
    },
    {
      text: "Enter Unit_4B",
      code: "2.d.2.2"
    },
    {
      text: "List the contents of Unit_4B",
      code: "x.d.3.2"
    },
    {
      text: "Read the lease file",
      code: "4.f.1.3"
    },
    {
      text: "Type: 'cat <file name>'  Example: cat lease.txt",
      code: "t.t.2.3"
    },
    {
      text: "Navigate back and enter Unit_7A",
      code: "2.d.1.4"
    },
    {
      text: "Delete the tenant record",
      code: "3.f.1.4"
    },
    {
      text: "Navigate to the Basement",
      code: "2.d.1.5"
    },
    {
      text: "Upload the retrieved file",
      code: "1.f.1.5"
    },
    {
      text: "Type: 'upload <file name>'  Example: upload data.bin",
      code: "t.t.2.5"
    }
  ],

  datafs: {
    user: 'Guest',
    hostname: 'ProjectExFiL',
    '/': {
      accessible: false,
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
            }
          }
        },
        'Complex': {
          type: 'dir',
          code: '2.d.1.1',
          customcode: 'x.d.1.2',
          children: {
            'Unit_4B': {
              accessible: true,
              type: 'dir',
              code: '2.d.2.2',
              customcode: 'x.d.3.2',
              children: {
                'lease.txt': {
                  type: 'file',
                  code: '4.f.1.3',
                  content: 'Tenant: R. Mallory. Lease expires: REDACTED. Notes: Do not contact.'
                }
              }
            },
            'Unit_7A': {
              accessible: true,
              type: 'dir',
              code: '2.d.1.4',
              children: {
                'tenant_record.dat': {
                  type: 'file',
                  code: '3.f.1.4',
                  content: 'ID: 7714. Status: FLAGGED. Clearance: NONE.'
                }
              }
            },
            'Unit_2C': {
              accessible: false,
              type: 'dir',
              children: {}
            },
            'Unit_9F': {
              accessible: false,
              type: 'dir',
              children: {}
            },
            'Basement': {
              accessible: true,
              type: 'dir',
              code: '2.d.1.5',
              children: {
                'payload.bin': {
                  type: 'file',
                  code: '1.f.1.5'
                }
              }
            }
          }
        }
      }
    }
  },

  phaseDialogue1: [
    "New location, operator.",
    "They call it the Apartment Complex.",
    "Lots of units. Lots of doors.",
    "Most of them locked."
  ],
  endPhase1: ["You found it. Keep moving."],

  phaseDialogue2: [
    "This place is bigger than it looks.",
    "Navigate carefully.",
    "Not every door opens."
  ],
  endPhase2: ["Unit_4B. That's the one."],

  phaseDialogue3: [
    "Someone left paperwork behind.",
    "Read it."
  ],
  endPhase3: ["Interesting. R. Mallory.", "Remember that name."],

  phaseDialogue4: [
    "Unit_7A has a record we can't leave behind.",
    "You know what to do.",
    "rm. Gone. Clean."
  ],
  endPhase4: ["Good.", "One last thing."],

  phaseDialogue5: [
    "The Basement.",
    "There's a payload sitting down there.",
    "Pull it out."
  ],
  endPhase5: [
    "That's everything.",
    "R. Mallory won't know what hit them.",
    "Good work, operator."
  ]
};