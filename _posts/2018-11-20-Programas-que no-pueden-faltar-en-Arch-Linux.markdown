---
title:
  20 Programas que no pueden faltar en Arch Linux - Post instalación de Arch
  Linux 2018.08.01
layout: post
date: '2018-11-20 00:00:00'
categories:
  - linux
  - archlinux
tags:
  - Linux
  - ArchLinux
image:
  path: /assets/images/posts/2018/arch-linux.png
  alt: "Arch Linux"
---

En este artículo haré mención de 20 programas que no pueden faltar en tú sistema Arch Linux. Haré una breve descripción de cada programa y como podemos instalarlo en nuestro equipo.

Pero primero que todo, antes de instalar cualquier programa, como es de costumbre, vamos a actualizar el cache del repositorio de paquetes de pacman:

```sh
$ sudo pacman -Sy
```

## net-tools

El paquete net-tools nos permite usar comandos como el **ifconfig**, entre otros.

Para instalar:

```sh
$ sudo pacman -S net-tools
```

**Nota:** Para ver revisar si un programa se encuentra en los repositorios oficiales de Arch Linux:

```sh
$ sudo pacman -Ss {nombrePrograma}
```

## Secure Shell

Cliente ssh, nos permite usar comandos como el **ssh**, **ssh-keygen**, entre otros.

Para instalar:

```sh
$ sudo pacman -S openssh
```

## Tree

Paquete para visualizar de manera rápido el árbol de carpetas/directorios.

Para instalar:

```sh
$ sudo pacman -S tree
```

## ZSH

El Zsh (shell Z) es un potente intérprete de comandos

Para instalar:

```sh
$ sudo pacman -S zsh
```

## Curl

Intérprete de comandos open source, software libre bajo la licencia MIT. Está orientado a la transferencia de archivos. Soporta los protocolos FTP, FTPS, HTTP, HTTPS, TFTP, SCP, SFTP, Telnet, DICT, FILE y LDAP, entre otros.

Para instalar:

```sh
$ sudo pacman -S curl
```

## Wget

GNU Wget es un paquete de software libre y gratuito. Está orientado a la descarga de archivos usando los protocolos de internet más usados com son HTTP, HTTPS, FPT, FTPS. Es una herramienta de línea de comandos no interactiva, por lo que se puede llamar fácilmente desde scripts, cronjobs, desde la terminal, etc.

Para instalar GNU Curl:

```sh
$ sudo pacman -S wget
```

## Locate

Es una nueva implementación del paquete locate. Nos permite hacer búsqueda de archivos en cualquier parte del sistema. Funciona en sistemas GNU/Linux.

Para instalar ejecutar:

```sh
$ sudo pacman -S mlocate
$ sudo updatedb
```

Para realizar una búsqueda:

```sh
$ locate nombre_archivo
```

## dmidecode

Este paquete es una herramienta que permite obtener información de los componentes de hardware del sistema.

Para instalar ingresar:

```sh
$ sudo pacman -S dmidecode
```

Para listar las opciones que podemos consultar:

```sh
$ sudo dmidecode -s string
```

Comando linux para encontrar el número serial:

```sh
$ sudo dmidecode -s system-serial-number
```

Como obtener la versión y fecha de la bios:

```sh
$ sudo dmidecode -s bios-release-date
$ sudo dmidecode -s bios-version
```

Como obtener el nombre del producto del sistema:

```sh
$ sudo dmidecode -s system-product-name
```

## Powerline

Es un complemento para la línea de comandos. Le da super poderes.

Instalación:

```sh
$ sudo pacman -S powerline powerline-fonts
```

## Otras fuentes

Paquetes de fuentes.

Instalación:

```sh
$ sudo pacman -S ttf-liberation ttf-dejavu ttf-freefont
```

Instalar con AUR:

```sh
ttf-ms-fonts
```

## Terminator

Es un emulador de terminal muy completo. Permite hacer split de la ventana, crear pestañas, configurar el perfil para cambiar el tema o bien crear un nuevo tema, etc.

Instalación:

```sh
$ sudo pacman -S terminator
```

## Vim

Vim es una versión mejorada del editor de texto Vi y uno de los editores de texto más poderosos hasta la fecha. Es open source y se distribuye bajo una licencia Charityware compatible con la licencia GPL.

Instalación:

```sh
$ pacman -S vim
```

## Git

Git es un sistema de control de versiones, el más popular en la actualidad. Es software libre y código abierto, diseñado por Linux Torvalds.

Instalación:

```sh
$ sudo pacman -S git
```

Verificamos la versión de Git instalada:

```sh
$ git --version
git version 2.18.0
```

Configurar usuario global:

```sh
$ git config --global user.name "Mi nombre"
$ git config --global user.email "mi@correo.com"
```

Listar configuración:

```sh
$ git config -l
```

Generar llave ssh:

```sh
$ ssh-keygen -t rsa -C "your_email@example.com"
```

## oh-my-zsh

Oh My Zsh es un framework para la gestión de la configuración de Zsh. Permite instalar temas, plugins, helpers, etc fácilmente. Es open source.

Requisitos:

- zsh
- curl
- git
- Powerline Fonts

```sh
$ sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Una vez finalizada la instalación reiniciar la terminal.

Para instalar el tema **agnoster** editar el archivo **~/.zshrc** y modificar el valor de ZSH_THEME="robbyrussell" por ZSH_THEME="agnoster"

```sh
ZSH_THEME="agnoster"
```

[oh-my-zsh - repositorio](https://github.com/robbyrussell/oh-my-zsh)

## NTFS filesystem driver and utilities

Soporte para dispositivos externos (pendrive y otros).

```sh
$ sudo pacman -S ntfs-3g
```

## Virtual filesystem implementation for GIO

Implementación del sistema de archivos virtual para GIO (backend SMB/CIFS; cliente de Windows)

Instalación:

```sh
$ sudo pacman -S gvfs-smb
```

## Soporte Media Transfer Protocol (MTP), Android

Este paquete da soporte para el protocolo de transferencia de datos multimedia MTP (Multimedia Transfer Protocol) de los sistemas Android.

Instalación:

```sh
$ sudo pacman -S gvfs-mtp
```

## Instalar Yaourt usando AUR

Yaourt es un gestor de paquetes como Pacman. La principal diferencia es que Pacman gestiona los repositorios oficiales, en cambio Yaourt los no oficiales (AUR).

Antes de instalar Yaourt usando necesitamos tener instalado git y wget.

Clonamos el repositorio AUR de package-query:

```sh
$ git clone https://aur.archlinux.org/package-query.git
```

Cambiamos de directorio a la carpeta del repositorio clonado e instalamos el paquete:

```sh
$ cd package-query
$ makepkg -si
```

Confirmamos la instalación. Una vez finalizada la instalación cambiamos de directorio y clonamos el repositorio AUR de Yaourt:

```sh
$ cd ..
$ git clone https://aur.archlinux.org/yaourt.git
```

Cambiamos de directorio a la carpeta del repositorio clonado e instalamos el paquete:

```sh
$ cd yaourt
$ makepkg -si
```

Finalmente eliminamos las carpetas de los repos clonados:

```sh
$ cd ..
$ rm -rf package-query yaourt
```

```sh
$ yaourt -V
yaourt 1.9
página web: http://archlinux.fr/yaourt-en
```

#### Uso

Sintaxis:

```sh
yaourt <operation> [options] [packages]
```

```sh
yaourt <search pattern|package file>
```

Para actualizar Arch Linux System, ejecutar:

```sh
$ yaourt -Syu
```

Para instalar un paquete, ejecutar:

```sh
$ yaourt -S <package-name>
```

Para hacer un upgrade de un paquete:

```sh
$ yaourt -U <package>
```

Para eliminar un paquete:

```sh
$ yaourt -R <package-name>
```

## VLC media player

Seguramente ya lo conocer... VLC es un reproductor multimedia libre y de código abierto multiplataforma. Reproduce la mayoría de archivos multimedia, DVD, Audio CD, VCD y diversos protocolos de transmisión.

```sh
$ sudo pacman -S vlc
```

## Libre Office

LibreOffice es un paquete de software de oficina libre y de código abierto

```sh
$ sudo pacman -S libreoffice-fresh
$ sudo pacman -S libreoffice-fresh-es
```

[Libre Office - Wiki Arch Linux](<https://wiki.archlinux.org/index.php/LibreOffice_(Espa%C3%B1ol)#Instalaci.C3.B3n>)
