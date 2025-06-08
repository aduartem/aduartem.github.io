---
layout: post
title: "Curso de Spring Boot"
date: 2025-06-07
categories:
- java
- springboot
tags:
- Java
- Spring Boot
- REST API
image:
  path: /assets/images/posts/2025/spring-boot.jpeg
  alt: "Spring Boot"
---

## Manejo de rutas dinámicas con @GetMapping y @PathVariable

`@GetMapping` es una anotación que mapea solicitudes HTTP GET a métodos específicos de un controlador. `@PathVariable` se utiliza para extraer valores de la URL y asignarlos como parámetros del método.

```java
@GetMapping("/api/tasks/{id}")
public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
    // El parámetro "id" se extrae de la URL /api/tasks/123
    Optional<Task> task = taskRepository.findById(id);
    return task.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
}
```

## Consultas parametrizadas con @GetMapping y @RequestParam

`@RequestParam` permite recuperar parámetros de consulta de la URL (query parameters).

```java
@GetMapping("/api/tasks/search")
public ResponseEntity<List<Task>> searchTasks(@RequestParam String title, @RequestParam(required = false) Boolean completed) {
    // Recibe parámetros como /api/tasks/search?title=Proyecto&completed=true
    List<Task> tasks = taskRepository.findByTitleContainingAndCompletedEquals(title, completed);
    return new ResponseEntity<>(tasks, HttpStatus.OK);
}
```

## Creación de recursos con @PostMapping y deserialización con @RequestBody

`@PostMapping` mapea solicitudes HTTP POST. `@RequestBody` convierte el cuerpo de la solicitud JSON en un objeto Java.

```java
@PostMapping("/api/tasks")
public ResponseEntity<Task> createTask(@RequestBody Task task) {
    // "task" se crea a partir del JSON del cuerpo de la petición
    Task savedTask = taskRepository.save(task);
    return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
}
```

## Control avanzado de respuestas HTTP con ResponseEntity

`@ResponseBody` indica que el valor de retorno del método debe ser serializado directamente en el cuerpo de la respuesta HTTP. `ResponseEntity` permite mayor control sobre la respuesta, incluyendo encabezados y códigos de estado.

```java
@GetMapping("/api/tasks")
public ResponseEntity<List<Task>> getAllTasks() {
    List<Task> tasks = taskRepository.findAll();
    return new ResponseEntity<>(tasks, HttpStatus.OK); // Devuelve código 200 con la lista
}
```

## Implementando el patrón DTO: Separación de datos y entidades

Los DTO son objetos que transportan datos entre procesos o capas de aplicación. Permiten transferir solo los datos necesarios y no exponer la estructura completa de entidades.

```java
// DTO para transferir solo datos relevantes de Task
public class TaskDTO {
    private Long id;
    private String title;
    private boolean completed;

    // Constructores, getters y setters

    // Método para convertir Entity a DTO
    public static TaskDTO fromEntity(Task task) {
        return new TaskDTO(task.getId(), task.getTitle(), task.isCompleted());
    }
}
```

## Diseño de arquitectura multicapa en aplicaciones Spring Boot

Spring Boot facilita la implementación de arquitecturas en capas:

- **Capa de presentación**: Controladores REST (@Controller, @RestController)
- **Capa de servicio**: Lógica de negocio (@Service)
- **Capa de acceso a datos**: Repositorios (@Repository)
- **Capa de dominio**: Entidades y modelos

```
com.example.app
├── controller    // Capa de presentación
├── service       // Capa de servicio
├── repository    // Capa de acceso a datos
├── model         // Capa de dominio
└── dto           // Objetos de transferencia
```

## Separación de responsabilidades con anotaciones @Repository y @Service

- **@Repository**: Marca una clase como repositorio, responsable de acceder a datos.
- **@Service**: Indica que una clase contiene lógica de negocio.

```java
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Métodos para acceso a datos
}

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}
```

## Principios fundamentales: Inversión de Control (IoC) en Spring

Es un principio de diseño donde el flujo de control se invierte: en lugar de que el código de la aplicación llame a una biblioteca, el framework llama al código. Spring Boot implementa IoC mediante su contenedor de IoC que gestiona el ciclo de vida de los componentes.

## Inyección de dependencias en Spring Boot

Es una técnica donde un objeto recibe otros objetos de los que depende. Spring Boot inyecta automáticamente dependencias en lugar de que las clases las creen.

```java
@RestController
public class TaskController {
    // TaskService se inyecta automáticamente
    @Autowired
    private TaskService taskService;
}
```

## Automatización de dependencias con @Autowired

Indica a Spring que inyecte automáticamente una dependencia. Puede aplicarse a constructores, métodos y campos.

```java
@Service
public class NotificationService {
    private final EmailService emailService;

    @Autowired // Inyección por constructor (recomendada)
    public NotificationService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```

## Fundamentos de persistencia: ORM + JPA

ORM (Object-Relational Mapping) mapea objetos Java a tablas de base de datos. JPA (Java Persistence API) es la especificación estándar para ORM en Java.

```java
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
}
```

## Hibernate como implementación de JPA

Hibernate es la implementación más popular de JPA. Spring Boot lo configura automáticamente como proveedor de persistencia predeterminado.

## Configuración inicial de persistencia con JPA y Hibernate

1. **Dependencias en pom.xml**:

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-jpa</artifactId>
   </dependency>
   <dependency>
       <groupId>com.mysql</groupId>
       <artifactId>mysql-connector-j</artifactId>
   </dependency>
   ```

2. **Configuración en application.properties**:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/taskdb
   spring.datasource.username=root
   spring.datasource.password=password
   spring.jpa.hibernate.ddl-auto=update
   ```

## Desarrollo rápido de operaciones CRUD con Spring Data JPA

Spring Data JPA proporciona el interfaz `JpaRepository` que incluye métodos CRUD básicos:

```java
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Métodos personalizados
    List<Task> findByCompleted(boolean completed);
}
```

## Modelado de relaciones entre entidades con JPA/Hibernate

### @OneToOne

```java
@Entity
public class User {
    @Id @GeneratedValue
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_id")
    private UserProfile profile;
}
```

### @OneToMany

```java
@Entity
public class User {
    @Id @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Task> tasks = new ArrayList<>();
}

@Entity
public class Task {
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

### @ManyToMany

```java
@Entity
public class Task {
    @ManyToMany
    @JoinTable(
        name = "task_tags",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();
}

@Entity
public class Tag {
    @ManyToMany(mappedBy = "tags")
    private Set<Task> tasks = new HashSet<>();
}
```

## Despliegue de aplicaciones Spring Boot con Docker: Guía práctica

1. **Crear un Dockerfile**:

   ```Dockerfile
   FROM eclipse-temurin:17-jdk
   WORKDIR /app
   COPY target/*.jar app.jar
   ENTRYPOINT ["java","-jar","/app/app.jar"]
   ```

2. **Construir la imagen**:

   ```bash
   docker build -t taskmanager-app .
   ```

3. **Ejecutar el contenedor**:

   ```bash
   docker run -p 8080:8080 taskmanager-app
   ```

4. **Docker Compose** (para incluir también la base de datos):
   ```yaml
   version: '3'
   services:
     app:
       build: .
       ports:
         - '8080:8080'
       environment:
         - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/taskdb
       depends_on:
         - db
     db:
       image: mysql:8
       environment:
         - MYSQL_ROOT_PASSWORD=password
         - MYSQL_DATABASE=taskdb
   ```
