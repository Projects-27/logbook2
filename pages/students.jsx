import React from 'react'
import Nav from '../components/Nav'
import BreadCrumb from 'funuicss/component/BreadCrumb'
import Button from 'funuicss/component/Button'
import Icon from 'funuicss/component/Icon'
import Link from 'next/link'
import Typography from 'funuicss/component/Typography';
import RowFlex from 'funuicss/component/RowFlex';
import Div from 'funuicss/component/Div';
import {FunGet} from 'funuicss/js/Fun'
import Modal from 'funuicss/component/Modal'
import ModalHeader from 'funuicss/component/ModalHeader'
import CloseModal from 'funuicss/component/CloseModal'
import ModalContent from 'funuicss/component/ModalContent'
import ModalAction from 'funuicss/component/ModalAction'
import Input from 'funuicss/component/Input'
import Section from 'funuicss/component/Section'
import { useState } from 'react'
import { useEffect } from 'react'
import { isOnline } from '../Functions/Functions'
import {FunRequest} from 'funuicss/js/Fun'
import { EndPoint } from '../components/EndPoint'
import Alert from 'funuicss/component/Alert'
import Axios from 'axios';
import Table from 'funuicss/component/Table'
import TableHead from 'funuicss/component/TableHead'
import TableData from 'funuicss/component/TableData'
import TableRow from 'funuicss/component/TableRow'


export default function Log() {
    const [modal2, setmodal2] = useState(false);
    const [me, setme] = useState('')
    const [loading, setloading] = useState(false)
    const [info, setinfo] = useState(false)
    const [message, setmessage] = useState('')
    const [students, setstudents] = useState('')
    const [deleteModal, setdeleteModal] = useState(false)
    const [editModal, seteditModal] = useState(false)
    const [search, setsearch] = useState('')
    const [viewDoc, setviewDoc] = useState('')
    const [route, setroute] = useState("/all/users")

    useEffect(() => {
     if(!students && me.id){
        Axios.get(EndPoint + route )
        .then(data=>{
         setstudents(data.data.data)
        }).catch(err=>console.log(err))
     }
    })
    
    useEffect(() => {
        setTimeout(()=>{
          setinfo(false)
          setmessage('')
          setloading(false)
        },3000)
      
        return () => {
          clearTimeout()
        }
      }, [loading , info])
useEffect(() => {
  if(!me){
    isOnline()
  .then(data=>{
    setme(data)
  if(data.isAdmin){
    if(data.role == 'supervisor'){
      setroute(`/supervisor/users/${data.Email}`)
    }else if(data.role == 'super'){
      setroute('/all/users')
    }
  }else{
    setroute(`/`)
  }
  })
  }
  })
const handleLog = ()=>{
const date = FunGet.val(".date")
const activity = FunGet.val(".activity")
const data = {
    Date: date,
    Activity: activity,
    StudentID: me.id
}

if(date && activity){
    setmodal2(false)
    setloading(true)
    setmessage("Creating Log: Please wait...")
    FunRequest.post(EndPoint + '/log', data).then((doc)=>{
        if(doc.status == "ok"){
            setinfo(true)
            setmessage("Data Inserted")
            setmodal2(false)
        }else{
            setinfo(true)
            setmessage(doc.message)
        }
    })
      .catch(err=>alert(err))
}else{
setinfo(true)
setmessage("Enter all details")
}
}

const [editDoc, seteditDoc] = useState('')
const HandleModal = (doc)=>{
seteditDoc(doc)
seteditModal(true)
}

  return (
    <div className='content'>
          {
        loading ?
        <Alert message={message} fixed="top-middle" type="success" isLoading />
        : info ? 
        <Alert message={message} fixed="top-middle" type="info" />
        :''
      }
<Modal 
animation="ScaleUp" 
duration={0.4} 
open={modal2}
backdrop
maxWidth="400px"
>
<ModalHeader>
<Typography text="Create/Edit Log" heading="h5"/>
<CloseModal  onClick={()=>setmodal2(false)}/>
</ModalHeader>
<ModalContent>
<Input label="Date" type='date' bordered fullWidth funcss="date" />
<Section />
<Input 
label="Activity"
 bordered
  fullWidth
  multiline
  funcss='activity'
  rows={5}
 />
<Section />
<Section />
<Button
text="Submit"
bg="primary"
fullWidth
onClick={handleLog}
/>
</ModalContent>
</Modal>


{
  viewDoc &&
  <Modal 
animation="ScaleUp" 
duration={0.4} 
open={editModal}
backdrop
maxWidth="500px"
>
<ModalHeader funcss='h5'>
  {viewDoc.UserName}
  <CloseModal  onClick={()=>seteditModal(false)}/>
</ModalHeader>
<ModalContent funcss="padding-20">
<RowFlex justify='space-between'>
  <Div>
  <Typography italic size='small' color='primary'>Student Id:</Typography> 
 <div />
 <Typography>{viewDoc.MatrixNumber}</Typography>
  </Div>
  <Div>
  <Typography italic size='small' color='primary'>Level:</Typography> 
 <div />
 <Typography>{viewDoc.Level}</Typography>
  </Div>

</RowFlex>
<p>
<Typography italic size='small' color='primary'>Supervisor:</Typography> 
   <Div funcss='border padding round-edge'>
    <RowFlex gap='0.3rem' justify='space-between'>
      <Div>
          <Typography italic size='small' color='primary'>Fullname:</Typography> 
    <div />
    {viewDoc.internal_supervisor.UserName}
      </Div>
      <Div>
          <Typography italic size='small' color='primary'>Contact:</Typography> 
    <div />
    {viewDoc.internal_supervisor.contact}
      </Div>
    </RowFlex>
    </Div>
  </p>
<p>
<Typography italic color='primary'>Organization:</Typography> 
   <Div funcss='border padding round-edge'>
    <RowFlex gap='0.3rem' justify='space-between'>
      <Div>
          <Typography italic size='small' color='primary'>Name:</Typography> 
    <div />
    {viewDoc.organization.name}
      </Div>
      <Div>
          <Typography italic size='small' color='primary'>Contact:</Typography> 
    <div />
    {viewDoc.organization.contact}
      </Div>
    </RowFlex>
    <div className="section hr"></div>
    <RowFlex gap='0.3rem' justify='space-between'>
      <Div>
          <Typography italic size='small' color='primary'>Supervisor:</Typography> 
    <div />
    {viewDoc.organization.supervisor}
      </Div>
      <Div>
          <Typography italic size='small' color='primary'>Address:</Typography> 
    <div />
    {viewDoc.organization.address}
      </Div>
    </RowFlex>
    </Div>
  </p>
</ModalContent>
</Modal>

}
      <Nav />
      <div>
      <Link href="/user" legacyBehavior>
           <Button rounded bg="light" small>
           <Icon icon="far fa-user" /> Profile
           </Button>
            </Link>
            <BreadCrumb type={"straight"} />
            <Link href="#" legacyBehavior>
           <Button rounded bg="primary" small>
           <Icon icon="bx bx-book" /> Students
           </Button>
            </Link>
            <div className="section">
              <RowFlex justify='space-between'>
                <Div>
                <Typography
                text="Students"
                heading='h4'
                lighter
                />
                <br />
                <Typography
               text="View and manage all students"
                />
                </Div>
              
              </RowFlex>
            </div>
         
      </div>
      <Div funcss="card text-small round-edge margin-top-30">
      <div className="padding hr">
      <RowFlex justify='space-between'>
      <Input label="Matric Number" onChange={(e)=>setsearch(e.target.value)}  />
      <div>
        <Typography
        text='records'
        italic 
        color='primary'
        />
        <div />
        <div className='h2'>
            
        {
            students &&
               students
               .filter(fDoc =>{
                 if(!search){
                     return students
                 }else if(search.toString().includes(fDoc.MatrixNumber.slice(0 , search.length))){
                         return fDoc
                 }
               }).length
        }
        </div>
      </div>
      </RowFlex>
      </div>
      <Table  stripped >
       <TableHead>
           <TableData>Matric</TableData>
           <TableData>Full Name</TableData>
           <TableData>Supervisor</TableData>
           <TableData>Level</TableData>
           <TableData>Department</TableData>
           <TableData>Institution</TableData>
           <TableData>View</TableData>
       </TableHead>
     {
      students &&
      students
      .filter(fDoc =>{
        if(!search){
            return students
        }else if(search.toString().includes(fDoc.MatrixNumber.slice(0 , search.length))){
                return fDoc
        }
      })
      .map(doc=>(
        <TableRow key={doc.id}>
        <TableData>{doc.MatrixNumber}</TableData>
        <TableData>{doc.UserName}</TableData>
        <TableData>{doc.internal_supervisor.UserName}</TableData>
        <TableData>{doc.Level}</TableData>
        <TableData>{doc.Department}</TableData>
        <TableData>{doc.organization.name}</TableData>
        <TableData>
          <Button bg='light-success' small rounded startIcon={<Icon icon="far fa-edit"  />}
          onClick={()=>{
            HandleModal(true)
            setviewDoc(doc)
          }}
          >View</Button>
          {/* {' | '}
          <Button bg='light-danger' small rounded>Delete</Button> */}
        </TableData>
    </TableRow>
      ))
     }
    </Table>
    </Div>
    </div>
  )
}


