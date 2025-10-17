# Deklarasi variabel
nilai_tugas = 0
bobot_tugas = 0.30

nilai_uts = 100
bobot_uts = 0.35

nilai_uas = 100
bobot_uas = 0.35

# Perhitungan nilai akhir
nilai_akhir = (nilai_tugas * bobot_tugas) + (nilai_uts * bobot_uts) + (nilai_uas * bobot_uas)

# Menentukan nilai huruf
if nilai_akhir >= 85:
    nilai_huruf = 'A'
elif nilai_akhir >= 80:
    nilai_huruf = 'B'
elif nilai_akhir >= 75:
    nilai_huruf = 'C'
elif nilai_akhir >= 70:
    nilai_huruf = 'D'
else:
    nilai_huruf = 'E'

# Menampilkan hasil
print("Nilai Akhir:", nilai_akhir)
print("Nilai Huruf:", nilai_huruf)
