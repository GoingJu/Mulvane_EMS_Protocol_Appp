import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>🔎</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? 'Search protocols…'}
        placeholderTextColor={theme.colors.muted}
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChange('')} hitSlop={10}>
          <Text style={styles.clear}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.space(3),
    height: 48,
  },
  icon: { fontSize: 16, marginRight: theme.space(2) },
  input: { flex: 1, fontSize: 17, color: theme.colors.text },
  clear: { fontSize: 16, color: theme.colors.muted, paddingHorizontal: theme.space(1) },
});
