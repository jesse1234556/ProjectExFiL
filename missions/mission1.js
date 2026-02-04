//legend for ID.
  //(f/d) is file or directory
  //so first objective is to upload file in phase 1, would be 1 (for upload).f.1 (for first ID).1 (for phase 1)
  //mission ID is typeOfObjetive.(f/d).IDWithinPhase.phaseCurrenetlyIn
  //type of objective legend: 1 = upload, 2 = access directory, 3 = delete file or directory, 4 = read file (cat). x = custom
export const mission1 = {
  name: "Orientation Protocol", 
  amountOfPhases: 3,
      //availablecommands, the numbers are the phases. so if 2 contains cd and ls then in phase 2 cd and ls are avaliable. 
      availableCommands: {
      1: [
        "cd"
      ],
      2:[
        "cd", "ls" 
      ],
        
    },

    objectives: [
     {
      text: "Type 'cd documents'",
      code: "2.d.1.1"
     },
     {
      text: "Use 'ls' to view the contents of the directory",
      code: "x.d.1.2"
     },
     {
      text: "Use 'cd' to enter into the correct directory",
      code: '2.d.2.2'
     },
     {
      text: "Type 'upload secret.png'",
      code: '1.f.1.3',
     }

    ]
  ,
    //datafs is the file system but in data instead of the real current one. 
    datafs: {
  user: 'Guest',
  hostname: 'ProjectExFiL',
  '/': {
    type: 'dir',
    children: {
      'shadow': {
        type: 'dir',
        children: {
          'secret.txt': {
            type: 'file',
            code: '1.f.2.1',
            content: 'you shouldnt be able to see this, how.',
          },
        }
      },
      'home': {
        type: 'dir',
        home: true,
        children: {
          'documents': {
            code: '2.d.1.1',
            customcode:'x.d.1.2',
            type: 'dir',
            children: {
             'NotThisOne':{
              type: 'dir',
              children: {
              }
             },
             'NotThisOne2':{
              type: 'dir',
              children: {
              }
             },
               'NotThisOne4':{
              type: 'dir',
              children: {
              }
             },
             'ThisOne!': {
              type: 'dir',
              code: '2.d.2.2',
              children:{
                'secret.png': {
                  type: 'file',
                  code: '1.f.1.3'
                }
              }
             }
            }
          }
        }
      }
    }
  }},


      
      phaseDialogue1: ["Hello, operator.",
              "I’ve been observing your activity.",
              "*PAUSE*",
              "You opened the wrong terminal.",
              "Now you're going to help me.",
              "*END*"], 
      endPhase1:[
        "Good, now I know you can read.",
        "Time to see how competent you are."
      ],
      phaseDialogue2: ["Complete the objectives listed in a timely matter."],
      endPhase2: ["Okay, you seem like a competent operator.", "Now time for the good stuff."],
      phaseDialogue3: ["Upload that secret image file to me.", "Quickly please."],
    }
