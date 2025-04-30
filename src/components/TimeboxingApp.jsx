import React, { useState, useEffect } from 'react';

const TimeboxingApp = () => {
  // Estado para almacenar los datos del formulario
  const [date, setDate] = useState('');
  const [priorities, setPriorities] = useState(['', '', '']);
  const [brainDump, setBrainDump] = useState('');
  const [schedule, setSchedule] = useState(Array(19).fill({':00': '', ':30': ''}));
  
  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('timeboxingData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setDate(parsedData.date || '');
      setPriorities(parsedData.priorities || ['', '', '']);
      setBrainDump(parsedData.brainDump || '');
      setSchedule(parsedData.schedule || Array(19).fill({':00': '', ':30': ''}));
    }
  }, []);
  
  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    const dataToSave = {
      date,
      priorities,
      brainDump,
      schedule
    };
    localStorage.setItem('timeboxingData', JSON.stringify(dataToSave));
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
    // Asignar índices basados en el diseño mostrado en la imagen
    const hourMap = {
      5: 0, 6: 1, 7: 2, 8: 3, 9: 4, 10: 5, 11: 6, 12: 7,
      1: 8, 2: 9, 3: 10, 4: 11, 5: 12, 6: 13, 7: 14, 8: 15, 9: 16, 10: 17, 11: 18
    };
    return hourMap[displayHour];
  };
  
  // Obtener hora visual desde índice de array
  const getDisplayHour = (index) => {
    const hourMap = {
      0: 5, 1: 6, 2: 7, 3: 8, 4: 9, 5: 10, 6: 11, 7: 12,
      8: 1, 9: 2, 10: 3, 11: 4, 12: 5, 13: 6, 14: 7, 15: 8, 16: 9, 17: 10, 18: 11
    };
    return hourMap[index];
  };

  // Limpiar todos los datos
  const handleClear = () => {
    if (window.confirm('¿Estás seguro que deseas borrar todos los datos?')) {
      setDate('');
      setPriorities(['', '', '']);
      setBrainDump('');
      setSchedule(Array(19).fill({':00': '', ':30': ''}));
      localStorage.removeItem('timeboxingData');
    }
  };

  const containerStyle = {
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
    maxWidth: '960px',
    backgroundColor: '#252525',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem'
  };

  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '1.5rem'
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: '#333',
    border: '1px solid #666',
    borderRadius: '0.25rem',
    padding: '0.5rem 0.75rem',
    marginBottom: '0.5rem',
    color: '#fff'
  };

  const textareaStyle = {
    ...inputStyle,
    height: '300px',
    resize: 'vertical'
  };

  const buttonStyle = {
    backgroundColor: '#d63031',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer'
  };

  const hourGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 2fr',
    gap: '0.25rem',
    marginBottom: '0.5rem'
  };

  const hourLabelStyle = {
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: '0.25rem',
    padding: '0.25rem'
  };

  // Media query para pantallas más grandes
  if (window.matchMedia("(min-width: 768px)").matches) {
    headerStyle.flexDirection = 'row';
    gridContainerStyle.gridTemplateColumns = '1fr 2fr';
  }
  
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Daily Timeboxing Planner</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '0.5rem' }}>Fecha:</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              style={{ ...inputStyle, marginBottom: 0 }}
            />
          </div>
        </div>
        
        <div style={gridContainerStyle}>
          {/* Columna izquierda - Prioridades y Brain Dump */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Top Prioridades</h2>
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
            
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Brain Dump</h2>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Horario</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '0.25rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 'bold' }}></div>
              <div style={{ fontWeight: 'bold', textAlign: 'center' }}>:00</div>
              <div style={{ fontWeight: 'bold', textAlign: 'center' }}>:30</div>
            </div>
            
            {Array.from({ length: 19 }).map((_, index) => {
              const hour = getDisplayHour(index);
              const period = index < 8 ? "AM" : "PM";
              
              return (
                <div key={index} style={hourGridStyle}>
                  <div style={hourLabelStyle}>
                    {hour}{period}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={schedule[index][':00'] || ''}
                      onChange={(e) => handleScheduleChange(hour, ':00', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={schedule[index][':30'] || ''}
                      onChange={(e) => handleScheduleChange(hour, ':30', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
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