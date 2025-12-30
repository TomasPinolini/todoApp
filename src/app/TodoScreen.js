import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTodos } from '../features/todos/useTodos';

export default function TodoScreen() {
  const { todos, add, toggleDone, isHydrating } = useTodos();
  const [newTask, setNewTask] = useState('');
  const [showDone, setShowDone] = useState(false);

  const onAdd = () => {
    add(newTask);
    setNewTask('');
  };

  const formatTime = (ts) => {
    if (typeof ts !== 'number') return '-';
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (ts) => {
    if (typeof ts !== 'number') return '-';
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString();
  };

  const getCreatedAt = (t) => (typeof t.createdAt === 'number' ? t.createdAt : t.created_at);
  const getDoneAt = (t) => (typeof t.doneAt === 'number' ? t.doneAt : t.done_at);

  const filteredTodos = showDone ? todos : todos.filter((t) => !t.done);
  const sortedTodos = [...filteredTodos].sort((a, b) => (getCreatedAt(b) ?? 0) - (getCreatedAt(a) ?? 0));

  const tableRows = [];
  let lastDateKey = null;
  for (const t of sortedTodos) {
    const createdAt = getCreatedAt(t);
    const dateKey = typeof createdAt === 'number' ? formatDate(createdAt) : '-';

    if (dateKey !== lastDateKey) {
      tableRows.push({ type: 'date', id: `date:${dateKey}`, dateKey });
      lastDateKey = dateKey;
    }

    tableRows.push({ type: 'todo', id: t.id, todo: t });
  }

  const renderRow = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>{item.dateKey}</Text>
        </View>
      );
    }

    const t = item.todo;
    return (
      <TouchableOpacity onPress={() => toggleDone(t.id)}>
        <View style={[styles.row, t.done ? styles.rowDone : null]}>
          <Text style={[styles.cell, styles.cellTask, t.done ? styles.textDone : null]} numberOfLines={1}>
            {t.text}
          </Text>
          <Text style={[styles.cell, styles.cellTime]} numberOfLines={1}>
            {formatTime(getCreatedAt(t))}
          </Text>
          {showDone ? (
            <Text style={[styles.cell, styles.cellTime]} numberOfLines={1}>
              {formatTime(getDoneAt(t))}
            </Text>
          ) : null}
          {showDone ? (
            <Text style={[styles.cell, styles.cellStatus]} numberOfLines={1}>
              {t.done ? 'Done' : 'Open'}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a task..."
        placeholderTextColor="#888"
        onChangeText={(newText) => setNewTask(newText)}
        value={newTask}
      />

      <TouchableOpacity style={styles.add_button} onPress={onAdd} disabled={isHydrating}>
        <Text style={styles.buttonText}>{isHydrating ? 'Loading...' : 'Add'}</Text>
      </TouchableOpacity>

      <View style={styles.controlsRow}>
        <Text style={styles.controlsLabel}>Show done</Text>
        <Switch value={showDone} onValueChange={setShowDone} />
      </View>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.cellTask]}>Task</Text>
          <Text style={[styles.headerCell, styles.cellTime]}>Time</Text>
          {showDone ? <Text style={[styles.headerCell, styles.cellTime]}>Done at</Text> : null}
          {showDone ? <Text style={[styles.headerCell, styles.cellStatus]}>Status</Text> : null}
        </View>
        <FlatList data={tableRows} renderItem={renderRow} keyExtractor={(item) => item.id} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingTop: 40,
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 18,
  },
  add_button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  controlsRow: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  controlsLabel: {
    color: '#ddd',
    fontSize: 14,
  },
  table: {
    width: '95%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#151515',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerCell: {
    color: '#bbb',
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#0f0f0f',
  },
  dateSeparator: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 2,
    borderTopColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  dateSeparatorText: {
    color: '#bbb',
    fontSize: 12,
    fontWeight: '700',
  },
  rowDone: {
    backgroundColor: '#0b0b0b',
  },
  cell: {
    color: 'white',
    fontSize: 12,
  },
  cellTask: {
    flex: 2.2,
    paddingRight: 8,
  },
  cellTime: {
    flex: 1.4,
    color: '#ddd',
  },
  cellStatus: {
    flex: 0.8,
    textAlign: 'right',
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
