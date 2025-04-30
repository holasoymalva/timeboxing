import React, { useState, useEffect } from 'react';

const TimeboxingApp = () => {
  // Estado para almacenar los datos del formulario
  const [date, setDate] = useState('');
  const [priorities, setPriorities] = useState(['', '', '']);
  const [brainDump, setBrainDump] = useState('');
  const [schedule, setSchedule] = useState(
    Array(19).fill().map(() => ({ ':00': '', ':30': '' }))
  );
  
  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('timeboxingData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setDate(parsedData.date || '');
        setPriorities(parsedData.priorities || ['', '', '']);
        setBrainDump(parsedData.brainDump || '');
        setSchedule(parsedData.schedule || Array(19).fill().map(() => ({ ':00': '', ':30': '' })));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }, []);
  
  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    try {
      const dataToSave = {
        date,
        priorities,
        brainDump,
        schedule
      };
      localStorage.setItem('timeboxingData', JSON.stringify(dataToSave));
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
  
  // Manejar cambios en el horario
  const handleScheduleChange = (hour, half, value) => {
    const newSchedule = [...schedule];
    const hourIndex = getHourIndex(hour);
    
    if (half === ':00') {
      newSchedule[hourIndex] = {...newSchedule[hourIndex], ':00': value};
    } else {
      newSchedule[hourIndex] = {...newSchedule[hourIndex], ':30': value};
    }
    
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

  // Limpiar todos los datos
  const handleClear = () => {
    if (window.confirm('¿Estás seguro que deseas borrar todos los datos?')) {
      setDate('');
      setPriorities(['', '', '']);
      setBrainDump('');
      setSchedule(Array(19).fill().map(() => ({ ':00': '', ':30': '' })));
      localStorage.removeItem('timeboxingData');
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

  // Media query para pantallas más grandes
  if (window.innerWidth >= 768) {
    contentContainerStyle.gridTemplateColumns = '300px 1fr';
    contentContainerStyle.gap = '2rem';
  }
  
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
        
        <div style={contentContainerStyle}>
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
                    onChange={(e) => handleScheduleChange(index + (index < 7 ? 5 : index > 7 ? -7 : 12), ':00', e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    value={schedule[index][':30'] || ''}
                    onChange={(e) => handleScheduleChange(index + (index < 7 ? 5 : index > 7 ? -7 : 12), ':30', e.target.value)}
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