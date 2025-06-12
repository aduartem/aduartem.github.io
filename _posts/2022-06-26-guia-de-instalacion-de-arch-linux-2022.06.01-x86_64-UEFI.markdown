---
title: 🐧 Guía de instalación de Arch Linux 2022.06.01 x86_64 (UEFI)
layout: post
date: '2022-06-26 02:00:00 -0400'
categories:
- linux
- archlinux
tags:
- Linux
- ArchLinux
image:
  path: /assets/images/posts/2018/f34a2f25-c4f4-4dae-927f-d08ecf25e07b.png
  alt: "Arch Linux"
---

Esta es una guía paso a paso de como instalar Arch Linux 2022.06.01 x86_64. Con esta guía el usuario será capaz de cambiar el idioma del teclado, particionar el disco, realizar la instalación de un entorno de escritorio y más, todo el proceso se realiza por línea de comandos.

## 1. Instalación base

Vamos a seleccionar la primera opción "Arch Linux install medium (x86_64, BIOS)"

### 1.1 Deshabilitar el molesto sonido de las teclas del teclado

```sh
$ rmmod pcspkr
```

### 1.2 Cambiar el idioma del teclado a español.

```sh
$ loadkeys es
```

### 1.3. Probando conectividad con la red.

```sh
$ ping -c 3 www.google.com
64 bytes from www.google.com (74.125.224.113): icmp_seq=3 ttl=57 time=27.5 ms
```

### 1.4. Particionar el disco

```sh
$ fdisk -l
```

```sh
$ cfdisk /dev/sda
```

Seleccionar label "**uefi**".

Si tenemos un sistema con 8 GiB o más de memoria probablemente podamos prescindir de la partición de swap. Sino podemos crear una. Crearemos las siguientes particiones:

Tamaño  | Tipo
------- | -------------------------------
250M    | EFI System
4G      | Linux swap
resto   | Linux, primaria

A continuación vamos a crear nuestra primera partición; Para esto debemos seguir los siguientes pasos:<br>
-> Con la tecla "enter" seleccionar el espacio libre del disco y seleccionar "New"<br>
-> Partition size: 250M<br>
-> Seleccionar [Type]<br>
-> Seleccionar [EFI System]<br>

Vamos a crear la segunda partición:
-> Presionamos la tecla de la flecha hacia abajo para seleccionar el espacio libre del disco y "enter" para seleccionar "New"<br>
-> Partition size: 4G<br>
-> Seleccionar [Type]<br>
-> Seleccionar "Linux swap"<br>

Ahora crearemos la última partición:
-> Seleccionar el espacio libre del disco y seleccionar "New"<br>
-> En "Partition size: " nos sugerirá lo que nos queda de espacio libre. Presionamos enter para asignar ese tamaño a nuestra nueva partición. Por defecto asignará tipo "Linux filesystem", eso está bien, lo dejamos como está.<br>

Finalmente
-> Seleccionar [Write]<br>
-> Para confirmar igresamos "yes" y presionamos la tecla enter.<br>
-> Seleccionar [Quit]<br>

Si ejecutamos el comando ```lsblk``` podemos ver lo que hemos definido.

### 1.5. Formateando las particiones

#### 1.5.1. Formatear la partición EFI

```sh
$ mkfs.fat -F32 /dev/sda1
```

#### 1.5.2. Formatear la partición /

```sh
$ mkfs.ext4 /dev/sda3
```

#### 1.6. Crear y activar la swap

Creamos la swap o espacio de intercambio:

```sh
$ mkswap /dev/sda2
```

Y activamos la swap:

```sh
$ swapon /dev/sda2
```

### 1.7. Montar las particiones

Lo siguiente que haremos es montar las particiones para empezar a usarlas, primero la partición root (/), que en esta guía es sda3 y luego la partición boot/efi (/boot/efi) que será sda1.

Si tenemos un disco **SSD** montamos las particiones usando las opciones de montaje adecuados para que se use TRIM:

```sh
$ mount -o noatime,discard /dev/sda3 /mnt
$ mkdir -p /mnt/boot/efi
$ mount -o noatime,discard /dev/sda1 /mnt/boot/efi
```

Si tenemos un disco **HDD** montamos las particiones de la siguiente forma:

```sh
$ mount /dev/sda3 /mnt
$ mkdir -p /mnt/boot/efi
$ mount /dev/sda1 /mnt/boot/efi
```

### 1.8. Instalar paquetes del sistema base

```sh
$ pacstrap -i /mnt linux linux-firmware linux-headers grub efibootmgr base base-devel sudo nano networkmanager
```

Nos dará elegir que paquetes queremos instalar. Presionar enter para que instale todo por defecto. Y luego ingresar "Y" para confirmar.

### 1.9. Generando el FSTAB.

Este archivo define cómo deben montarse las particiones de disco en el sistema de archivos.

```sh
$ genfstab -U -p /mnt > /mnt/etc/fstab
```

y comprobamos con:

```sh
$ cat !$
```

### 1.10. Chroot y configuración de sistema base

Hacemos un chroot para cambiar el directorio root que estamos usando para configurar nuestro sistema.

```sh
$ arch-chroot /mnt
```

Vamos a utilizar el comando ```passwd``` para definir una contraseña para el usuarios root

```sh
$ passwd
```

### 1.11. Crear Usuario

Si ingresamos el comando ```ls /home/``` podemos ver que no existe ninguna carpeta de usuario.

Para crear un usuario vamos a utilizar el comando ```useradd```. En este ejemplo nuestro usuario se llamará "foo", ustedes reemplacen el nombre del usuario por el que quieran.

```sh
$ useradd -m foo
```

Si ingresamos nuevamente el comando ```ls /home/ -l``` podemos ver que ahora hay una nueva carpeta con el nombre del usuario y esta tiene usuario y grupo "foo", esto quiere decir que a parte del usuario root que tiene acceso a todo, nuestro nuevo usuario es el único dueño de esta carpeta.

Cambiamos la contraseña con ```passwd```:

```sh
$ passwd foo
```

Ahora vamos a agregar a nuestro nuevo usuario al grupo wheel para que este pueda ser super usuario:

```sh
$ usermod -aG wheel foo
```

Revisamos los grupos de nuestro usuario con el comando ```groups```.

```sh
$ groups foo
```

Y nos debería aparecer algo como:

```
wheel foo
```

Ahora vamos a abrir el archivo sudoers que sa encuentra en ```/etc/sudoers```.

```sh
$ nano /etc/sudoers
```

Descomentamos la siguiente línea:

```sh
# %wheel ALL=(ALL) ALL
```

Quitando el signo "#":

```sh
%wheel ALL=(ALL) ALL
```

Y guardamos el archivo. Con esta configuración si ingresamos ```sudo su```, el sistema nos pediré la contraseña del usuario antes de convertirlo en root.

Para cambiar de usuario ocupamos el comando ```su``` y el nombre del usuario.

A modo de prueba nos cambiamos de usuario:

```sh
$ su foo
```

Podemos verificar nuestro usuario con el comando ```whoami```.

Ahora ingresemos el comando ```sudo su```

```sh
$ sudo su
```

Nos pedirá contraseña la contraseña de nuestro usuario, la ingresamos y nuestro usuario será root nuevamente.

Para salir de estos usuarios:

```sh
$ exit
$ exit
```


### 1.12. Vamos a establecer la región del teclado

```sh
$ nano /etc/locale.gen
```

Hacemos ctrl+w para buscar, y filtramos por ```en_US.UTF-8 UTF-8```. Esta línea la vamos a descomentar.

```sh
#en_US.UTF-8 UTF-8
```

Quedando de esta forma:

```sh
en_US.UTF-8 UTF-8
```

Y haremos lo mismo con ```es_CL.UTF-8 UTF-8``` en el caso de Chile o ```es_ES.UTF-8 UTF-8``` para el caso de España.

```sh
#es_CL.UTF-8 UTF-8
```

Quedando de esta forma:

```sh
es_CL.UTF-8 UTF-8
```

Una vez realizados los cambios, guardamos el archivo.

Ahora ingresamos el siguiente comando para aplicar los cambios:

```sh
$ locale-gen
```

La salida por pantalla debería ser algo como esto:

```sh
Generating locales...
  en_US.UTF-8... done
  es_CL.UTF-8.. done
Generation complete.
```

Para evitar ingresar a cada rato el comando ```loadkeys es``` vamos a editar el archivo ```/etc/vconsole.conf``` para cambiar el mapa de teclas de las terminales TTY:

```sh
$ nano /etc/vconsole.conf
```

Ingresamos lo siguiente:

```sh
KEYMAP=es
```

y guardamos el archivo.

Con esto, la próxima vez que reinicies el equipo, va a estar en español el teclado.

Para más información respecto a este tema te dejo el link de la documentación oficial de archlinux: [Linux console/Keyboard configuration](https://wiki.archlinux.org/title/Linux_console/Keyboard_configuration)


### 1.13. Establecer la zona horaria

Establecemos la zona horaria de nuestro sistema:

```sh
$ ln -s /usr/share/zoneinfo/America/Santiago /etc/localtime
```

Configuramos el reloj de hardware en modo UTC:

```sh
$ hwclock --systohc --utc
```

### 1.14. Modificar el nombre de nuesta máquina

```sh
$ echo archlinux > /etc/hostname
```

### 1.15. Configurar el archivo hosts

Abrimos el archivo hosts:

```sh
$ nano /etc/hosts
```

Ingresamos el siguiente contenido al final del archivo:

```sh
127.0.0.1     localhost
::1           localhost
```

Guardamos el archivo.

Comprobamos que el archivo quedó correctamente escrito:

```sh
$ cat /etc/hosts
```

### 1.16. Instalar el gestor de arranque (Boot loader)

```sh
$ grub-install /dev/sda
```

```sh
$ nano /etc/default/grub
```

Editamos el archivo ```/etc/default/grub``` para descomentar/agregar la línea ```GRUB_DISABLE_OS_PROBER=false```, guardamos y ejecutamos el siguiente comando para crear el archivo de configuración del grub:

```sh
$ grub-mkconfig -o /boot/grub/grub.cfg
```

**Nota:** -o es letra y no el número cero.


### 1.17. Finalizar la instalación

```sh
$ exit
$ reboot
```

Si quieres ver la Guía oficial de instalación de Arch Linux [pincha aquí](https://wiki.archlinux.org/index.php/Install_guide).

## 2. Post instalación base

### 2.1. Habilitar servicio NetworkManager

Luego de iniciar sesión con nuestro usuario, lo primero que vamos a hacer es habilitar el servicio NetworkManager:

```sh
$ sudo systemctl enable NetworkManager.service
```

Una vez realizado esto, reiniciamos la máquina:

```sh
$ sudo reboot
```

también podemos reiniciar la máquina con:

```sh
$ sudo shutdown -r now
```

Una vez reiniciada, nos logueamos nuevamente y probamos conectividad con la red.

```sh
$ ping -c 3 www.google.com
64 bytes from www.google.com (74.125.224.113): icmp_seq=3 ttl=57 time=27.5 ms
```

### 2.2. Sincronizar las bases de datos de paquetes

```sh
$ sudo pacman -Syu
```

### 2.3. Instalar neofetch

Es un paquete que al ejecutarse en la terminal recopila información del sistema y la muestra al usuario de forma amigable, incluyendo un logotipo de la distro que se está utilizando en formato ASCII.

```sh
$ sudo pacman -S neofetch
```

Una vez instalado, lo ejecutamos con el comando ```neofetch```.

```sh
$ neofetch
```

### 2.4. Xorg

Antes de instalar el entorno de escritorio vamos a instalar el servidor de visualización y algunas utilidades:

```sh
$ sudo pacman -S xorg xorg-server xorg-apps xorg-xinit xterm --noconfirm
```

Una vez finalizada la instalación ingresamos el siguiente comando para verificar que todo este bien:

```sh
$ startx
```

Si nos muestra tres terminales con fondo de color blanco, es por que la instalación finalizo correctamente y podemos salir ingresando "exit".


```sh
$ exit
```

### 2.5. Intel graphics - Xorg Drivers

Prerequisito: Xorg.

```sh
$ sudo pacman -S xf86-video-intel xf86-input-synaptics
```

### 2.6. LightDM

LightDM es un ligero y rápido gestor de sesiones para X Window System. Vamos a ingresar los siguientes comandos:

```sh
$ sudo pacman -S lightdm-gtk-greeter lightdm-service
$ sudo systemctl enable lightdm.service
$ sudo reboot
```

### 2.7. Para instalar Gnome Desktop

Tenemos dos opciones, instalar Gnome sin programas por defecto preinstalados o con todos los programas por defecto preinstalados


**Instalación mímima**

```sh
$ sudo pacman -S gnome-control-center gdm
$ sudo systemctl enable gdm.service
$ sudo reboot
```

**Instalación completa**

```sh
$ sudo pacman -S gnome
```

Nos preguntará sobre algunos paquetes, dejaremos todo por defecto. Vamos a presionar enter a todo.

Una vez finalizada la instalación ingresaremos este comando para asegurarnos que en la pantalla de inicio de sesión el teclado esté configurado en español (o el lenguaje que queramos):

```sh
$ sudo localectl set-x11-keymap es
```

Finalmente habilitamos el servicio de Gnome y reiniciamos el equipo.

```sh
$ sudo systemctl enable gdm.service
$ sudo reboot
```

### 2.8. Algunos paquetes recomendables.

- ```gufw```: Firewall.

- ```unrar```: Utilidad de descompresión de archivos .rar.

- ```git```: El sistema de control de versiones más utilizado hoy en día por desarrolladores de software.

- ```vim```: Potente editor de texto. Versión mejorada del editor Vi.

- ```wget```: Descarga archivos usando los protocolos de internet más usados como son HTTP, HTTPS, FPT, FTPS.

- ```zsh```: Potente intérprete de comandos.

- ```nmap```: Permite revisar los puertos de una máquina.

- ```net-tools```: Permite usar comandos como el ifconfig, entre otros.

- ```htop```: Completo sistema de monitorización.

- ```mlocate```: Permite hacer búsqueda de archivos en cualquier parte del sistema.

- ```tree```: Paquete para visualizar de manera rápida el árbol de carpetas/directorios.

- ```ntfs-3g```: Soporte para dispositivos externos (pendrive y otros) que usen sistema de archivos NTFS.

- ```gvfs-smb```: Implementación del sistema de archivos virtual para GIO (backend SMB/CIFS; cliente de Windows)

- ```gvfs-mtp```: Este paquete da soporte para el protocolo de transferencia de datos multimedia MTP (Multimedia Transfer Protocol) de los sistemas Android.

- ```psensor```: Programa que monitorea la temperatura del hardware del equipo.

- ```dmidecode```: Herramienta que permite obtener información de los componentes de hardware del sistema.

- ```terminator```: Terminator es un emulador de terminal muy completo. Una de sus caracteristicas más destacables es que permite hacer split de la ventana para abrir multiples terminales.

- ```bleachbit```: Bleachbit Es una herramienta de limpieza del disco duro.

- ```vlc```: Reproductor multimedia que reproduce la mayoría de los archivos multimedia gracias a tiene la mayoría de codecs necesarios.

- ```gnome-tweak-tool```: Herramienta para configurar la apariencia de Gnome.

Instalación:

```sh
$ sudo pacman -S gufw unrar git vim wget zsh nmap net-tools htop mlocate tree  \
ntfs-3g gvfs-smb gvfs-mtp psensor dmidecode terminator bleachbit vlc gnome-tweak-tool
```


### 2.9. Wallpapers y fuentes

```sh
$ sudo pacman -S archlinux-wallpaper powerline-fonts nerd-fonts ttf-liberation ttf-dejavu ttf-freefont
```

### 2.10. Oh My Zsh

Oh My Zsh es un framework para la gestión de la configuración de Zsh. Permite instalar temas, plugins, helpers, etc fácilmente. Es open source.

Para instalarlo:

```sh
$ sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

[oh-my-zsh - repositorio](https://github.com/robbyrussell/oh-my-zsh)

[sitio web oficial](https://ohmyz.sh/)

### Si el sistema está instalado en una VM de Virtualbox

#### Virtualbox Guest Additions

```sh
$ sudo pacman -S virtualbox-guest-utils
$ sudo systemctl enable vboxservice.service
```
