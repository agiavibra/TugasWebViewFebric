import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import InteractiveWebView from './src/components/InteractiveWebView';

const INTERACTIVE_HTML = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Web Interaktif</title>
  <style>
    * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
    body {
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      color: #1e293b;
    }
    .card {
      background: #ffffff;
      border-radius: 14px;
      padding: 18px;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
      margin-bottom: 16px;
    }
    h2 { margin: 0 0 8px; font-size: 18px; color: #1d4ed8; }
    p { margin: 0 0 12px; font-size: 14px; color: #475569; line-height: 1.5; }
    .counter-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f8fafc;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      margin-bottom: 12px;
    }
    .count-value { font-size: 24px; font-weight: 700; color: #0f172a; }
    button {
      background: #2563eb;
      color: #fff;
      border: none;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    button:active { opacity: 0.85; }
    button.secondary { background: #0f766e; }
    .badge {
      display: inline-block;
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    }
    #rnMessageBox {
      margin-top: 10px;
      padding: 10px;
      background: #fef9c3;
      border-left: 4px solid #eab308;
      border-radius: 6px;
      font-size: 13px;
      color: #713f12;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">React Native WebView • Fabric</span>
    <h2 style="margin-top: 10px;">Konten Web Interaktif</h2>
    <p>Ubah nilai counter di dalam web lalu kirimkan statusnya langsung ke aplikasi React Native.</p>

    <div class="counter-box">
      <span class="count-value" id="count">0</span>
      <div>
        <button onclick="updateCount(-1)">-1</button>
        <button onclick="updateCount(1)">+1</button>
      </div>
    </div>

    <button class="secondary" onclick="sendToNative()">Kirim Data ke React Native</button>
    <div id="rnMessageBox">Menunggu pesan dari React Native...</div>
  </div>

  <script>
    let count = 0;

    function updateCount(delta) {
      count += delta;
      document.getElementById('count').textContent = count;
    }

    function sendToNative() {
      const payload = {
        type: 'COUNTER_UPDATE',
        count: count,
        timestamp: new Date().toLocaleTimeString('id-ID')
      };
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      }
    }

    function receiveFromNative(text) {
      document.getElementById('rnMessageBox').textContent = 'Dari RN: ' + text;
    }
  </script>
</body>
</html>
`;

export default function App() {
  const webViewRef = useRef(null);
  const [inputText, setInputText] = useState('Halo dari React Native!');
  const [statusLog, setStatusLog] = useState('Siap berinteraksi dengan WebView');
  const [isLoading, setIsLoading] = useState(true);

  const handleSendToWeb = () => {
    const cleanText = inputText.trim() || 'Pesan kosong';
    const escapedText = JSON.stringify(cleanText);
    webViewRef.current?.injectJavaScript(`
      if (typeof receiveFromNative === 'function') {
        receiveFromNative(${escapedText});
      }
      true;
    `);
    setStatusLog(`Mengirim ke Web: "${cleanText}"`);
  };

  const handleMessageFromWeb = event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'COUNTER_UPDATE') {
        setStatusLog(
          `Counter dari Web: ${data.count} (pukul ${data.timestamp})`,
        );
      }
    } catch {
      setStatusLog(`Pesan Web: ${event.nativeEvent.data}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={styles.header}>
        <Text style={styles.title}>WebView Interaktif (Fabric)</Text>
        <Text style={styles.status}>{statusLog}</Text>
      </View>

      <View style={styles.controlBar}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ketik pesan untuk halaman web..."
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity style={styles.button} onPress={handleSendToWeb}>
          <Text style={styles.buttonText}>Kirim</Text>
        </TouchableOpacity>
      </View>

      <InteractiveWebView
        ref={webViewRef}
        htmlContent={INTERACTIVE_HTML}
        onMessageFromWeb={handleMessageFromWeb}
        isLoading={isLoading}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  status: {
    marginTop: 4,
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  controlBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  button: {
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
