import React, { useState , useEffect , useRef } from 'react'


function HomeComp() { 
    const [populate , setPopulate] = useState(false)

    const [ firstAudiosList , setFirstAudiosList] = useState([]);
    const [ secondAudiosList , setSecondAudiosList] = useState([]);
    const [ compStatusList , setCompStatusList ] = useState([]);
    const [ progStatusList , setProgStatusList ] = useState([]);


    const [option1 , setOption1]  = useState("")
    const [option2 , setOption2] = useState("")

    const [disableBt1 , setDisableBt1] = useState(false);



    useEffect(()=>{
        populateRows();
    } , []   )

    useEffect(()=>{
        fetchStatuses();
    } , [])

    const populateRows = ()=>{
        let getUrl  = 'https://g512odfrv1.execute-api.us-east-1.amazonaws.com/getAudios'        
        fetch(getUrl)
            .then(rawData => {
            return rawData.json();
            }).then(data => {
                if(data.status){
                  console.log(data.msg.length , data.msg.length/2)
                  let firstAudios = data.msg.slice(0 , data.msg.length/2)
                  let secondAudios = data.msg.slice(data.msg.length/2 , data.msg.length)
                let List1 = [];
                let List2 = [];
                  for (let index = 0; index < firstAudios.length; index++) {
                    const name = firstAudios[index];
                    List1.push(<option key={`${index}-first`} value={name}>{name}</option>)
                }      
                for (let index = 0; index < secondAudios.length; index++) {
                  const name2 = secondAudios[index];
                  List2.push(<option key={`${index}-second`} value={name2} >{name2}</option>)
                        }
                setFirstAudiosList(List1)
                setSecondAudiosList(List2)
                }

        });
   }

   const getValue=(event , id)=>{
    if(id == "1"){setOption1(event.target.value)}
    else{setOption2(event.target.value)}
   }

    const triggerLambda = ()=>{
        let audio1;
        let audio2;
        let postUrl = 'https://g512odfrv1.execute-api.us-east-1.amazonaws.com/invoke'
        if(option1 != '' && option2 != ""){
            console.log("Ready to go")
            audio1 = option1;
            audio2 = option2;
            console.log("Ready to go" , audio1 , audio2)

            setDisableBt1(true);
            let payLoad = {"audio1"  : audio1 , "audio2" : audio2}

            let sendData = JSON.stringify(payLoad) 

            fetch(postUrl, {
                method: 'POST', // or 'PUT'
                headers: {
                  'Content-Type': 'application/json',
                },
                body: sendData,
              })
              .then(response => response.json())
              .then(data => {
                console.log('Success:', data);
                alert("Process Added to Que")
                setDisableBt1(false);
              })
              .catch((error) => {
                console.error('Error:', error);
              });

        }
        else{alert('Select 2 Audio Files')}
    }   
      

    const fetchStatuses = ()=>{
        let tasksUrl = 'https://g512odfrv1.execute-api.us-east-1.amazonaws.com/alltasks'
        let progLis = [];
        let compLis = [];
        fetch(tasksUrl)
        .then(rawData => {
        return rawData.json();
        }).then(data => {
            console.log(data)
            if(data.status){
                for(const obj of data.info){
                    console.log(obj)
                    if(obj.status == 'STOPPED'){
                        compLis.push(<option key={`${0}-first`} value={`${obj.arn}`}>{`${obj.arn}`}</option>) 
                    }
                    else{ 
                        progLis.push(<option key={`${0}-first`} value={`${obj.arn}`}>{`${obj.arn}`}</option>)
                    }
                  }
                setCompStatusList(compLis)
                setProgStatusList(progLis)
          
            }
         });
        

    }


    const reload = ()=>{
        console.log('Callaback reload')
        setPopulate(true)

    }
      

  return (
    
    <div>
        {console.log('====>' ,progStatusList)}
        <div>
            <div>
                <label htmlFor="FirstFile">Choose an audio file:</label>
                <select name="FirstFile" id="firstAudios" onChange={(e)=>{getValue(e , "1")}  } >
                    <option value="none" selected disabled hidden>Select first audio file</option>
                    {firstAudiosList}
                </select>
            </div>

            <div>
                <label htmlFor="SecondFile">Choose an audio file:</label>
                    <select  name="SecondFile" id="secondAudios" onChange={(e)=>{getValue(e , "2")} }>
                        <option value="none" selected disabled hidden>Select second audio file</option>
                        {secondAudiosList}            
                </select>
            </div>
        </div>

        <button className="button button1" onClick={triggerLambda} disabled={disableBt1} >{disableBt1 ? "Adding To Que ..." :  "Merge Audios"}</button>

        <div>
        <label htmlFor="inProgress">In Progress Files:</label>
        <select name="inProgress" id="progAudios">
            {progStatusList}
        </select>

        <label htmlFor="completedFiles">Completed audio Files:</label>
        <select name="completedFiles" id="compAudios">
            {compStatusList}
        </select>
        </div>

        <button className="button button1" onClick={reload} >Reload Status</button>

    </div>
    );}

export default HomeComp;

