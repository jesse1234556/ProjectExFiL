//legend for ID.
  //(f/d) is file or directory
  //so first objective is to upload file in phase 1, would be 1 (for upload).f.1 (for first ID).1 (for phase 1)
  //mission ID is typeOfObjetive.(f/d).IDWithinPhase.phaseCurrenetlyIn
  //type of objective legend: 1 = upload, 2 = access directory, 3 = delete file or directory, 4 = read file (cat). x = custom
  //objective code, the (f/d) could also be 't' which meants text. It still renders in order, in phase, but the 1st decimal is ignored. 
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
      text: "Type 'cd Home'",
      code: "2.d.1.1"
     },
     {
      text:"cd = Change directory",
      code: "t.t.3.1",
     },{
      text:"cd = Change directory",
      code: "t.t.5.2",
     },
     {
      text:"",
      code: "t.t.2.1",
     },
     {
      text:"ls = List directory",
      code: "t.t.4.2",
     },
     {
      text:"",
      code: "t.t.3.2",
     },
      {
      text:"",
      code: "t.t.2.2",
     },
     {
      text: "Type 'ls' to view the contents of the directory",
      code: "x.d.1.2"
     },
     {
      text: "Enter the Pictures directory",
      code: '2.d.2.2'
     },
     {
      text: "Type 'upload secret.png'",
      code: '1.f.2.3',
     },
     {
      text: "View the Pictures directory",
      code: 'x.d.1.3',
     }

    ]
  ,
    //datafs is the file system but in data instead of the real current one. 
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
          },
        }
      },
      'Home': {
        type: 'dir',
        code: '2.d.1.1',
        customcode:'x.d.1.2',
        children: {
             'Documents':{
              accessible: false,
              type: 'dir',
              children: {
              }
             },
             'Pictures':{
              customcode: 'x.d.1.3',
              accessible: true,
              type: 'dir',
              code: '2.d.2.2',
              children:{
                'secret.png': {
                  type: 'file',
                  code: '1.f.2.3'
                }
              },
            },
              'Music':{
              accessible: false,
              type: 'dir',
              children: {
              }
             },
             'Videos': {
              accessible: false,
              type: 'dir',
             }
        }
      }
    }
  }},

      
    phaseDialogue1: ["Hello, operator.",
              "Welcome to Orientation.",
    ],
    endPhase1: [""],
      phaseDialogue2: [ "You are inside a computer filesystem.",`You are always in a single directory.`,"Directories hold files and other directories.","Use ls to see a list of folders in your current location,", "and use cd followed by a folder's name to move inside it." ],
      endPhase2: ["Okay, you seem like a competent operator.", "Now time for the good stuff."],
      phaseDialogue3: ["Upload that secret image file to me.", "Quickly please."],
      endPhase3: ["Thanks!"]
    }
