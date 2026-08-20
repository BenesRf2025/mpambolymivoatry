import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { ChevronDown, Check } from '../../lib/icons';

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Remplace <select> HTML : ouvre une feuille modale en bas d'écran avec la liste des options. */
export const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View>
      {label && <Text className="text-xs font-bold text-brand-brown mb-1">{label}</Text>}
      <Pressable
        onPress={() => setOpen(true)}
        className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 flex-row items-center justify-between"
      >
        <Text className="text-xs font-medium text-brand-brown" numberOfLines={1}>
          {selected?.label || placeholder || '—'}
        </Text>
        <ChevronDown className="w-4 h-4 text-brand-brownLight" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white rounded-t-3xl p-4 pb-8" style={{ maxHeight: '70%' }}>
            {label && <Text className="text-sm font-black text-brand-brown mb-2">{label}</Text>}
            <ScrollView>
              {options.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="flex-row items-center justify-between py-3 border-b border-brand-beige"
                >
                  <Text className="text-sm text-[#2A2621] flex-1">{opt.label}</Text>
                  {value === opt.value && <Check className="w-4 h-4 text-brand-green" />}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
