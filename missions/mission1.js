//legend for ID.
  //(f/d) is file or directory
  //so first objective is to upload file in phase 1, would be 1 (for upload).f.1 (for first ID).1 (for phase 1)
  //mission ID is typeOfObjetive.(f/d).IDWithinPhase.phaseCurrenetlyIn
  //type of objective legend: 1 = upload, 2 = access directory, 3 = delete file or directory, 4 = read file (cat).
 
export const mission1 = {
  name: "Orientation Protocol", 

      //availablecommands, the numbers are the phases. so if 2 contains cd and ls then in phase 2 cd and ls are avaliable. 
      availableCommands: {
      1: [
        "cd", "help"
      ],
      2:[
        "cd", "ls" 
      ],
        
    },

    objectives: [
      {
        code: "1.f.1.1",
        text:"Upload notes.txt", 
      },
      {
        code: "1.f.3.1",
        text:"Upload passwords.txt",
        
      },
      {
        code: "2.d.2.1",
        text: "Access 'etc' directory",
        
      },
      { 
        code: "3.d.4.1",
        text:"Delete 'user' directory",
         
      },
      {     
        code: "4.f.4.2",
        text: "Read 'passwd' file",
        
      },
    ]
  ,




    //datafs is the file system but in data instead of the real current one. 
    datafs: {
  user: 'Guest',
  hostname: 'ProjectExFiL',
  '/': {
    type: 'dir',
    children: {
      'passwords.txt': 
      {
        type: 'file', 
        content:"brrx153",
        code:"1.f.3.1"},
      'bin': {
        type: 'dir',
        children: {
          'ls': { type: 'file', content: 'ELF binary' }
        }
      },

      'etc': {
        type: 'dir',
        code:'2.d.2.1',
        children: {
          'passwd': {
            code: "4.f.4.2",
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
            code: '3.d.4.1',
            type: 'dir',
            children: {
              'notes.txt': { type: 'file', code: '1.f.1.1', content: 'My test notes' }
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
        "Good your a fast learner.",
        "Now onto your next objective."
      ],
      phaseDialogue2: ["Placeholder phase2 mission 1"],
    }
