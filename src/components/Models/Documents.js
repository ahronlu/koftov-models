import React, { useRef, useState,useEffect } from "react";
import {
  Icon,
  Form,
  Button,
  Header,
  Table
} from "semantic-ui-react";
import moment from "moment";
import { db, storage } from "../../firebase";

export const Documents = ({ modelId }) => {
const modelDocsRef = db.collection("models").doc(modelId).collection("documents");
  const [document, setDocument] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [description, setDescription] = useState("");
  const [isLoading, setLoading] = useState(false);
  const fileInput = useRef()

  useEffect(() => {
    const getDocuments = async () => {
      const querySnapshot = await db.collection("models").doc(modelId).collection("documents").get()
      setDocuments(querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })))
    }
    getDocuments();
  }, [modelId]);

  const deleteDocument = async (id) => {
    if (window.confirm("למחוק את המסמך?")) {
        await await modelDocsRef.doc(id).delete();
        window.location.reload();
    }
  }

  const onFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!modelId || !document) return;
    setLoading(true);
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`${modelId}/${new Date().toISOString().slice(0,19).replace(":","-")}.jpg`);
    try {
      await fileRef.put(document);
      const url = await fileRef.getDownloadURL();
      await modelDocsRef.add({
          description: description,
          url,
      });
      window.location.reload()
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
        <Header>הוסף מסמך</Header>
        <Form onSubmit={onSubmit}>
          <Form.Group widths="equal">
                <input ref={fileInput} style={{display:"none"}} type="file" onChange={onFileChange} width={5}/>
                <Button onClick={e => console.log(fileInput.current.click())}>בחר קובץ</Button>
                <Form.Input
                    placeholder="פרטים"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    width={6}
                />
                <Button
                color="green"
                loading={isLoading}
                disabled={isLoading}
                width={5}
            >
                הוסף מסמך
        </Button>
          </Form.Group>

        </Form>
        <Table celled striped textAlign="right">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell width={2}>תאריך</Table.HeaderCell>
                    <Table.HeaderCell>פרטים</Table.HeaderCell>
                    <Table.HeaderCell width={1}>מחיקה</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {documents.length ? documents.map((document,i) => (
                    <Table.Row key={i}>
                        <Table.Cell><a target="_blank" rel="noopener noreferrer" href={document.url}>{moment(document.date).format("DD/MM/YYYY")}</a></Table.Cell>
                        <Table.Cell>{document.description}</Table.Cell>
                        <Table.Cell><Icon link name="delete" onClick={() => deleteDocument(document.id)}/></Table.Cell>
                    </Table.Row>)) : <Table.Row><Table.Cell colSpan="3">אין עדיין מסמכים להצגה</Table.Cell></Table.Row>}
            </Table.Body>
        </Table>
    </>
  );
};
