import { View, Text ,Button, FlatList, TouchableOpacity, Image,TextInput, Modal, Alert } from 'react-native'

import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

interface Task {
    id: string;
  title: string;
  description: string;
  photo: string;
  dueDate: Date;
   
  }
  //notification
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  const getToken=async()=>{
    const token=await messaging().getToken();
    console.log("token=  ",token)
  }
const Taches = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [formData, setFormData] = useState({ title: '', description: '', photo: '', dueDate: '' });
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
   useEffect(() =>{
    requestUserPermission();
    getToken();
   })
   
   
    useEffect(() => {
        const subscriber = firestore()
          .collection('tasks')
          .onSnapshot(querySnapshot => {
            const tasksData: Task[] = [];
            querySnapshot.forEach(documentSnapshot => {
              const data = documentSnapshot.data();
              tasksData.push({
                id: documentSnapshot.id,
                title: data.title || '',
                description: data.description || '',
                photo: data.photo || '',
                dueDate: data.dueDate.toDate()
              });
            });
            setTasks(tasksData);
          });
    
  
      return () => subscriber();
    }, []);
       //alert
    useEffect(() => {
      const interval = setInterval(() => {
        tasks.forEach(task => {
          if (new Date() > task.dueDate) {
            Alert.alert('Tâche en retard', `La tâche "${task.title}" est en retard !`);
          }
        }); 
      }, 50000);
  
      return () => clearInterval(interval);
    }, [tasks]);
  //ajouter une image
  const handleChoosePhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });
  
    if (result.assets && result.assets.length > 0) {
      const base64Image = `data:${result.assets[0].type};base64,${result.assets[0].base64}`;
      setFormData({ ...formData, photo: base64Image });
    }
  };
    const handleSaveTask = async () => {
      try {
        if (editingTask) {
          // Modification
          await firestore()
            .collection('tasks')
            .doc(editingTask.id)
            .update({
              ...formData,
              dueDate: firestore.Timestamp.fromDate(new Date(formData.dueDate))
            });
        } else {
          // Création
          await firestore().collection('tasks').add({
            ...formData,
            dueDate: firestore.Timestamp.fromDate(new Date(formData.dueDate))
          });
        }
        
        setFormData({ title: '', description: '', photo: '', dueDate: '' });
        setModalVisible(false);
        setEditingTask(null);
      } catch (error) {
        Alert.alert('Erreur', 'Opération échouée');
      }
    };
  
    const handleDeleteTask = async (id: string) => {
      try {
        await firestore().collection('tasks').doc(id).delete();
        setSelectedTask(null);
      } catch (error) {
        Alert.alert('Erreur', 'Suppression échouée');
      }
    };
  
    const openEditModal = (task: Task) => {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        photo: task.photo,
        dueDate: task.dueDate.toISOString().split('T')[0] 
      });
      setModalVisible(true);
    };
  
    return (
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Liste des Tâches</Text>
        
        <Button title="Ajouter une tâche" onPress={() => {
          setEditingTask(null);
          setModalVisible(true);
        }} />
  
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ 
                padding: 15, 
                marginVertical: 5, 
                backgroundColor: '#f0f0f0',
                borderRadius: 5
              }}
              onPress={() => setSelectedTask(item)}
            >
              <Text style={{ fontSize: 18 }}>{item.title}</Text>
              <Text style={{ color: 'gray' }}>
                Échéance: {item.dueDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />
  
        {/* Modal de création/modification */}
        <Modal visible={modalVisible} animationType="slide">
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20 }}>
              {editingTask ? 'Modifier la tâche' : 'Nouvelle Tâche'}
            </Text>
            
            <TextInput
              placeholder="Titre"
              value={formData.title}
              onChangeText={text => setFormData({ ...formData, title: text })}
              style={{ marginVertical: 10, borderBottomWidth: 1 }}
            />
            
            <TextInput
              placeholder="Description"
              value={formData.description}
              onChangeText={text => setFormData({ ...formData, description: text })}
              style={{ marginVertical: 10, borderBottomWidth: 1 }}
            />
        
            <TextInput
              placeholder="Date d'échéance (AAAA-MM-JJ)"
              value={formData.dueDate}
              onChangeText={text => setFormData({ ...formData, dueDate: text })}
              style={{ marginVertical: 10, borderBottomWidth: 1 }}
            />
               <Button title="Choisir une image" onPress={handleChoosePhoto} />
            {formData.photo ? (
                <Image 
                  source={{ uri: formData.photo }} 
                  style={{ width: 100, height: 100, marginTop: 10 }} 
                />
              ) : null}
            
        
         
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
              <Button title="Annuler" onPress={() => {
                setModalVisible(false);
                setEditingTask(null);
              }} color="red" />
              
              <Button 
                title={editingTask ? "Sauvegarder" : "Créer"} 
                onPress={handleSaveTask} 
              />
            </View>
          </View>
        </Modal>
  
        {/* Détails de la tâche */}
        {selectedTask && (
          <Modal visible={!!selectedTask} animationType="slide">
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 24 }}>{selectedTask.title}</Text>
              
              {selectedTask.photo && (
                <Image 
                  source={{ uri: selectedTask.photo }} 
                  style={{ width: 200, height: 200, marginVertical: 10 }}
                />
              )}
              
              <Text>{selectedTask.description}</Text>
              <Text style={{ marginTop: 10 }}>
                Échéance: {selectedTask.dueDate.toLocaleDateString()}
              </Text>
              
              <View style={{ marginTop: 20 }}>
                <Button 
                  title="Modifier" 
                  onPress={() => openEditModal(selectedTask)} 
                  color="green"
                />
                
                <Button title="Fermer" onPress={() => setSelectedTask(null)} />
                
                <Button 
                  title="Supprimer" 
                  onPress={() => handleDeleteTask(selectedTask.id)} 
                  color="red" 
                />
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
};

export default Taches