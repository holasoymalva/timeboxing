import React, { useState, useEffect } from 'react';

const TimeboxingApp = () => {
  // Estado para almacenar los datos del formulario
  const [date, setDate] = useState('');
  const [priorities, setPriorities] = useState(['', '', '']);
  const [brainDump, setBrainDump] = useState('');
  const [schedule, setSchedule] = useState(
    Array(19).fill().map(() => ({ ':00': '', ':30': '' }))
  );
  
  // Cargar datos desde localStorage al iniciar - VERSIÓN ARREGLADA
  useEffect(() => {
    try {
      console.log("Intentando cargar datos desde localStorage...");
      const savedData = localStorage.getItem('timeboxingData');
      console.log("Datos recuperados:", savedData ? "Sí" : "No");
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Datos parseados correctamente");
        
        // Asegurarse de que schedule tenga la estructura correcta
        const loadedSchedule = parsedData.schedule || [];
        // Crear un nuevo array para evitar problemas de referencia
        const safeSchedule = Array(19).fill().map((_, index) => {
          if (index < loadedSchedule.length) {
            return {
              ':00': loadedSchedule[index][':00'] || '',
              ':30': loadedSchedule[index][':30'] || ''
            };
          }
          return { ':00': '', ':30': '' };
        });
        
        setDate(parsedData.date || '');
        setPriorities(Array.isArray(parsedData.priorities) ? [...parsedData.priorities] : ['', '', '']);
        setBrainDump(parsedData.brainDump || '');
        setSchedule(safeSchedule);
        
        console.log("Datos cargados correctamente en el estado");
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }, []);
  
  // Guardar datos en localStorage cuando cambian - VERSIÓN ARREGLADA
  useEffect(() => {
    try {
      // No guardar en el primer renderizado (cuando los estados están vacíos)
      if (date === '' && priorities.every(p => p === '') && brainDump === '' && 
          schedule.every(s => s[':00'] === '' && s[':30'] === '')) {
        console.log("Saltando guardado inicial con datos vacíos");
        return;
      }
      
      console.log("Guardando datos en localStorage...");
      
      // Crear copias profundas de los datos para evitar referencias compartidas
      const scheduleCopy = schedule.map(slot => ({ ...slot }));
      const prioritiesCopy = [...priorities];
      
      const dataToSave = {
        date,
        priorities: prioritiesCopy,
        brainDump,
        schedule: scheduleCopy
      };
      
      localStorage.setItem('timeboxingData', JSON.stringify(dataToSave));
      console.log("Datos guardados correctamente en localStorage");
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  }, [date, priorities, brainDump, schedule]);
  
  // Manejar cambios en las prioridades
  const handlePriorityChange = (index, value) => {
    const newPriorities = [...priorities];
    newPriorities[index] = value;
    setPriorities(newPriorities);
  };
  
  // Manejar cambios en el horario - VERSIÓN ARREGLADA
  const handleScheduleChange = (timeIndex, half, value) => {
    // Crear una copia profunda del estado schedule
    const newSchedule = schedule.map(slot => ({ ...slot }));
    
    // Configurar el valor en la copia
    if (half === ':00') {
      newSchedule[timeIndex] = { ...newSchedule[timeIndex], ':00': value };
    } else {
      newSchedule[timeIndex] = { ...newSchedule[timeIndex], ':30': value };
    }
    
    // Actualizar el estado con la copia
    setSchedule(newSchedule);
  };
  
  // Convertir hora visual (5-11AM, 1-11PM) a índice de array (0-18)
  const getHourIndex = (displayHour) => {
    // Conversión de horas visuales a índices del array
    if (displayHour === 12) return 7; // 12 PM es índice 7
    if (displayHour >= 1 && displayHour <= 11) {
      return displayHour < 5 ? displayHour + 7 : displayHour - 5;
    }
    return 0; // Valor por defecto
  };
  
  // Obtener hora visual y período desde índice de array
  const getTimeLabel = (index) => {
    if (index <= 6) return `${index + 5}AM`; // 5AM-11AM
    if (index === 7) return '12PM'; // 12PM
    if (index >= 8) return `${index - 7}PM`; // 1PM-11PM
    return '';
  };

  // Limpiar todos los datos - VERSIÓN ARREGLADA
  const handleClear = () => {
    if (window.confirm('¿Estás seguro que deseas borrar todos los datos?')) {
      setDate('');
      setPriorities(['', '', '']);
      setBrainDump('');
      setSchedule(Array(19).fill().map(() => ({ ':00': '', ':30': '' })));
      
      // Eliminar datos del localStorage
      localStorage.removeItem('timeboxingData');
      console.log("Datos borrados correctamente");
    }
  };

  // Estilos para la aplicación
  const appContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '1rem'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '90%',
    backgroundColor: '#252525',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    margin: '0 auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  };

  const contentContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem'
  };

  const sectionContainerStyle = {
    marginBottom: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: '#333',
    border: '1px solid #444',
    borderRadius: '4px',
    padding: '0.75rem',
    marginBottom: '0.75rem',
    color: '#fff',
    boxSizing: 'border-box'
  };

  const textareaStyle = {
    ...inputStyle,
    height: '200px',
    resize: 'vertical'
  };

  const timeBlockContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '80px 1fr 1fr',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    alignItems: 'center'
  };

  const timeBlockLabelStyle = {
    backgroundColor: '#333',
    padding: '0.5rem',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold'
  };

  const buttonStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  };

  const datePickerStyle = {
    ...inputStyle,
    width: 'auto',
    marginBottom: 0
  };

  // Aplicar estilos responsivos
  const isLargeScreen = window.innerWidth >= 768;
  
  return (
    <div style={appContainerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0 }}>Daily Timeboxing Planner</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '0.5rem' }}>Fecha:</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              style={datePickerStyle}
            />
          </div>
        </div>
        
        <div style={{
          ...contentContainerStyle,
          gridTemplateColumns: isLargeScreen ? '300px 1fr' : '1fr',
          gap: isLargeScreen ? '2rem' : '1rem'
        }}>
          {/* Columna izquierda - Prioridades y Brain Dump */}
          <div>
            <div style={sectionContainerStyle}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Top Prioridades</h2>
              {priorities.map((priority, index) => (
                <input
                  key={index}
                  type="text"
                  value={priority}
                  onChange={(e) => handlePriorityChange(index, e.target.value)}
                  placeholder={`Prioridad ${index + 1}`}
                  style={inputStyle}
                />
              ))}
            </div>
            
            <div style={sectionContainerStyle}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Brain Dump</h2>
              <textarea
                value={brainDump}
                onChange={(e) => setBrainDump(e.target.value)}
                style={textareaStyle}
                placeholder="Escribe todas tus ideas aquí..."
              />
            </div>
          </div>
          
          {/* Columna derecha - Horario */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Horario</h2>
            
            <div style={{ marginBottom: '1rem', display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '0.5rem' }}>
              <div></div>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>:00</div>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>:30</div>
            </div>
            
            {Array.from({ length: 19 }).map((_, index) => {
              const timeLabel = getTimeLabel(index);
              
              return (
                <div key={index} style={timeBlockContainerStyle}>
                  <div style={timeBlockLabelStyle}>
                    {timeLabel}
                  </div>
                  <input
                    type="text"
                    value={schedule[index][':00'] || ''}
                    onChange={(e) => handleScheduleChange(index, ':00', e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    value={schedule[index][':30'] || ''}
                    onChange={(e) => handleScheduleChange(index, ':30', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              );
            })}
          </div>
        </div>
        
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleClear} 
            style={buttonStyle}
          >
            Limpiar Todo
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeboxingApp;