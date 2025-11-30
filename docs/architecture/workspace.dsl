workspace "PDFAgent Pro" "AI-Powered PDF Editor - System Architecture" {

    model {
        # People / Actors
        sarah = person "Sarah - Freelance Lawyer" "Freelance contract lawyer who needs to review, redact, and extract clauses from multiple legal documents efficiently."
        marcus = person "Marcus - Marketing Manager" "Marketing operations manager who processes competitor reports, brand guidelines, and extracts insights from lengthy PDFs."
        
        # External Systems
        llmProvider = softwareSystem "LLM Provider" "External AI service (OpenAI/GitHub Models) that provides natural language processing and generation capabilities." "External"
        objectStorage = softwareSystem "Object Storage" "Cloud storage service (S3/Azure Blob) for storing PDF files and processed documents." "External"
        
        # Main Software System
        pdfAgentPro = softwareSystem "PDFAgent Pro" "AI-powered PDF editing platform that enables professionals to edit, summarize, and extract data from PDFs using conversational AI." {
            
            # Containers (Level 2)
            webApp = container "Web Application" "Provides the user interface for PDF editing, chat interactions, and document management via browser." "React/TypeScript" "Web Browser"
            
            backendApi = container "Backend API" "Handles user requests, orchestrates workflows, manages authentication and authorization." "Node.js/Express" "API"
            
            aiOrchestration = container "AI Orchestration Service" "Processes natural language commands, maintains conversation context, and coordinates with LLM providers." "Python/LangChain" "Service"
            
            pdfProcessing = container "PDF Processing Service" "Performs OCR, text extraction, table detection, and PDF manipulation operations." "Python/PyPDF2/Tesseract" "Service"
            
            dataStore = container "Data Store" "Stores user data, document metadata, chat history, analytics events, and processed results." "PostgreSQL" "Database"
            
            # Relationships - User to System
            sarah -> webApp "Uploads PDFs, issues natural language commands, reviews redacted documents"
            marcus -> webApp "Uploads reports, requests summaries, exports extracted data"
            
            # Relationships - Web App to Backend
            webApp -> backendApi "Sends user commands, uploads files, retrieves results" "HTTPS/REST"
            
            # Relationships - Backend API orchestration
            backendApi -> aiOrchestration "Forwards natural language commands with document context" "gRPC"
            backendApi -> pdfProcessing "Requests PDF parsing, text extraction, table detection" "gRPC"
            backendApi -> dataStore "Reads/writes user data, documents, chat history, events" "SQL"
            backendApi -> objectStorage "Uploads original PDFs, stores processed documents" "S3 API"
            
            # Relationships - AI Orchestration
            aiOrchestration -> llmProvider "Sends prompts for intent classification, content generation, summarization" "HTTPS/API"
            aiOrchestration -> dataStore "Stores conversation context, AI responses, confidence scores" "SQL"
            
            # Relationships - PDF Processing
            pdfProcessing -> objectStorage "Retrieves PDFs for processing, stores modified versions" "S3 API"
            pdfProcessing -> dataStore "Saves extracted text, tables, metadata" "SQL"
        }
        
        # Deployment Environment (optional for Level 2)
        deploymentEnvironment "Production" {
            deploymentNode "AWS Cloud" "" "AWS" {
                deploymentNode "CloudFront CDN" "" "AWS CloudFront" {
                    containerInstance webApp
                }
                
                deploymentNode "ECS Cluster" "" "AWS ECS" {
                    deploymentNode "Backend Container" "" "Docker" {
                        containerInstance backendApi
                    }
                    deploymentNode "AI Service Container" "" "Docker" {
                        containerInstance aiOrchestration
                    }
                    deploymentNode "PDF Service Container" "" "Docker" {
                        containerInstance pdfProcessing
                    }
                }
                
                deploymentNode "RDS" "" "AWS RDS" {
                    containerInstance dataStore
                }
                
                deploymentNode "S3" "" "AWS S3" {
                    softwareSystemInstance objectStorage
                }
            }
        }
    }
    
    views {
        # System Context Diagram (Level 1)
        systemContext pdfAgentPro "SystemContext" {
            include *
            autoLayout
            description "System context diagram showing PDFAgent Pro and its relationships with users and external systems."
        }
        
        # Container Diagram (Level 2)
        container pdfAgentPro "Containers" {
            include *
            autoLayout
            description "Container diagram showing the internal architecture of PDFAgent Pro with web app, API, AI services, and data stores."
        }
        
        # Deployment Diagram
        deployment pdfAgentPro "Production" "Deployment" {
            include *
            autoLayout
            description "Production deployment architecture on AWS cloud infrastructure."
        }
        
        # Styling
        styles {
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "External" {
                background #999999
                color #ffffff
            }
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Web Browser" {
                shape WebBrowser
            }
            element "Database" {
                shape Cylinder
            }
            element "Service" {
                shape Hexagon
            }
            element "API" {
                shape RoundedBox
            }
        }
    }
    
    configuration {
        scope softwaresystem
    }
}
