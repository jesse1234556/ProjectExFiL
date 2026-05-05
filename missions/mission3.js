//legend for ID.
  //(f/d) is file or directory
  //so first objective is to upload file in phase 1, would be 1 (for upload).f.1 (for first ID).1 (for phase 1)
  //mission ID is typeOfObjetive.(f/d).IDWithinPhase.phaseCurrenetlyIn
  //type of objective legend: 1 = upload, 2 = access directory, 3 = delete file or directory, 4 = read file (cat).
 export const mission3 = {
  name: "Apartment Complex",
  amountOfPhases: 5,

  availableCommands: {
    1: ["cd", "ls"],
    2: ["cd", "ls", "cat"],
    3: ["cd", "ls", "cat"],
    4: ["cd", "ls", "cat", "rm"],
    5: ["cd", "ls", "cat", "rm", "upload"]
  },

  objectives: [
    // Phase 1 - navigate, find the manifest
    {
      text: "List the contents of the Complex",
      code: "x.d.1.1"
    },
    {
      text: "Enter the Management directory",
      code: "2.d.2.1"
    },
    {
      text: "List the contents of Management",
      code: "x.d.3.1"
    },

    // Phase 2 - read files to find the target unit
    {
      text: "Read the files in Management",
      code: "4.f.1.2"
    },
    {
      text: "Enter the Units directory",
      code: "2.d.2.2"
    },
    {
      text: "List the contents of Units",
      code: "x.d.3.2"
    },
    {
      text: "Enter the target unit",
      code: "2.d.4.2"
    },
    {
      text: "List its contents",
      code: "x.d.5.2"
    },

    // Phase 3 - read the file inside the unit
    {
      text: "Read the file",
      code: "4.f.1.3"
    },
    {
      text: "Go back to Management",
      code: "2.d.2.3"
    },
    {
      text: "Read the eviction log",
      code: "4.f.3.3"
    },

    // Phase 4 - delete based on what was read
    {
      text: "Navigate to the target unit",
      code: "2.d.1.4"
    },
    {
      text: "Delete the file",
      code: "3.f.2.4"
    },

    // Phase 5 - upload
    {
      text: "Navigate to the Basement",
      code: "2.d.1.5"
    },
    {
      text: "List the contents of Basement",
      code: "x.d.2.5"
    },
    {
      text: "Upload the payload",
      code: "1.f.3.5"
    },
    {
      text: "Type: 'upload <file name>'",
      code: "t.t.4.5"
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
        'Complex': {
          type: 'dir',
          customcode: 'x.d.1.1',
          children: {
            'Management': {
              accessible: true,
              type: 'dir',
              code: ['2.d.2.1' , '2.d.2.3'],
              customcode: ['x.d.3.1'],
              children: {
                'active_leases.csv': {
                  type: 'file',
                  code: '4.f.1.2',
                  content: 'UNIT,TENANT,STATUS\nUnit_03,R.Mallory,ACTIVE\nUnit_11,P.Voss,ACTIVE\nUnit_19,K.Duren,EVICTED\nUnit_27,T.Hale,ACTIVE\n\nFLAGGED FOR REVIEW: Unit_03\n\n'
                },
                'eviction_log.txt': {
                  type: 'file',
                  code: '4.f.3.3',
                  content: 'EVICTION RECORDS\n---\nUnit_19 | K.Duren | Evicted 04.11\nFile marked for deletion: residency_agreement.pdf\nPending wipe. Authorization required.'
                }
              }
            },
            'Units': {
              accessible: true,
              type: 'dir',
              code: '2.d.2.2',
              customcode: 'x.d.3.2',
              children: {
                'Unit_01': { accessible: false, type: 'dir', children: {} },
                'Unit_02': { accessible: false, type: 'dir', children: {} },
                'Unit_03': {
                  accessible: true,
                  type: 'dir',
                  code: '2.d.4.2',
                  customcode: 'x.d.5.2',
                  children: {
                    'lease_data.json': {
                      type: 'file',
                      code: '4.f.1.3',
                      content: '{\n  "tenant": "R. Mallory",\n  "unit": "03",\n  "lease_start": "REDACTED",\n  "clearance": "NONE",\n  "notes": "Do not contact. Flag for removal."\n}'
                    }
                  }
                },
                'Unit_04': { accessible: false, type: 'dir', children: {} },
                'Unit_05': { accessible: false, type: 'dir', children: {} },
                'Unit_06': { accessible: false, type: 'dir', children: {} },
                'Unit_07': { accessible: false, type: 'dir', children: {} },
                'Unit_08': { accessible: false, type: 'dir', children: {} },
                'Unit_09': { accessible: false, type: 'dir', children: {} },
                'Unit_10': { accessible: false, type: 'dir', children: {} },
                'Unit_11': { accessible: false, type: 'dir', children: {} },
                'Unit_12': { accessible: false, type: 'dir', children: {} },
                'Unit_19': {
                  accessible: true,
                  type: 'dir',
                  code: '2.d.1.4',
                  children: {
                    'residency_agreement.pdf': {
                      type: 'file',
                      code: '3.f.2.4',
                      content: 'RESIDENCY AGREEMENT | K. Duren | Unit_19\nStatus: EVICTED\nMarked for deletion.'
                    }
                  }
                },
                'Unit_20': { accessible: false, type: 'dir', children: {} },
                'Unit_21': { accessible: false, type: 'dir', children: {} },
                'Unit_27': { accessible: false, type: 'dir', children: {} },
              }
            },
            'Basement': {
              accessible: true,
              type: 'dir',
              code: '2.d.1.5',
              customcode: 'x.d.2.5',
              children: {
                'exfil.bin': {
                  type: 'file',
                  code: '1.f.3.5'
                }
              }
            }
          }
        }
      }
    }
  },

  phaseDialogue1: [
    "Apartment Complex.",
    "Managed server. Lots of tenants.",
    "Start in Management."
  ],
  endPhase1: ["You found the records.", "Read carefully."],

  phaseDialogue2: [
    "Files tell you where to go.",
    "Pay attention to what's flagged."
  ],
  endPhase2: ["There's Mallory's data.", "And something else in that log."],

  phaseDialogue3: [
    "Two things to read.",
    "Both matter."
  ],
  endPhase3: ["Duren's file needs to disappear.", "You know which one."],

  phaseDialogue4: [
    "Clean it up."
  ],
  endPhase4: ["Done.", "One more thing."],

  phaseDialogue5: [
    "Basement.",
    "Pull the payload and get out."
  ],
  endPhase5: [
    "Complex cleared.",
    "Good work, operator."
  ]
};