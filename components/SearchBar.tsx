import { useMemo } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../theme';

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: Props) {
  const { colors, space, radius } = useTheme();
  const styles = useMemo(() => makeStyles(colors, space, radius), [colors, space, radius]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>🔎</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? 'Search protocols…'}
        placeholderTextColor={colors.muted}
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

function makeStyles(colors: ThemeColors, space: (n: number) => number, radius: number) {
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: space(3),
      height: 48,
    },
    icon: { fontSize: 16, marginRight: space(2) },
    input: { flex: 1, fontSize: 17, color: colors.text },
    clear: { fontSize: 16, color: colors.muted, paddingHorizontal: space(1) },
  });
}
