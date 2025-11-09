// Types for the decision tree
export enum NodeType {
  DECISION = 'DECISION',
  OUTCOME = 'OUTCOME'
}

export enum PerformanceLevel {
  LOW = 'Low Performance',
  MEDIUM = 'Medium Performance',
  HIGH = 'High Performance'
}

export interface DecisionNode {
  id: string;
  type: NodeType.DECISION;
  question: string;
  branches: Branch[];
}

export interface OutcomeNode {
  id: string;
  type: NodeType.OUTCOME;
  result: PerformanceLevel;
  icon?: string;
}

export interface Branch {
  condition: string;
  label: string;
  nextNode: DecisionNode | OutcomeNode;
}

export type TreeNode = DecisionNode | OutcomeNode;

// Step execution state
export interface ExecutionStep {
  node: TreeNode;
  path: string[];
  answers: Map<string, string>;
}

export class StudentAnalyzerTree {
  private root: DecisionNode;
  private currentStep: ExecutionStep;

  constructor() {
    this.root = this.buildTree();
    this.currentStep = {
      node: this.root,
      path: [],
      answers: new Map()
    };
  }

  private buildTree(): DecisionNode {
    // Build the tree from bottom up
    
    // Left side - Attendance < 70% branch
    const homeworkLowNode: OutcomeNode = {
      id: 'outcome_1',
      type: NodeType.OUTCOME,
      result: PerformanceLevel.LOW,
      icon: '⚙️'
    };

    const parentInvHighNode: OutcomeNode = {
      id: 'outcome_2',
      type: NodeType.OUTCOME,
      result: PerformanceLevel.MEDIUM,
      icon: '👏'
    };

    const parentInvLowNode: OutcomeNode = {
      id: 'outcome_3',
      type: NodeType.OUTCOME,
      result: PerformanceLevel.LOW,
      icon: '⚙️'
    };

    const parentInvNode: DecisionNode = {
      id: 'parent_involvement',
      type: NodeType.DECISION,
      question: 'Parent Involvement',
      branches: [
        {
          condition: 'high',
          label: 'High',
          nextNode: parentInvHighNode
        },
        {
          condition: 'low_medium',
          label: 'Low / Medium',
          nextNode: parentInvLowNode
        }
      ]
    };

    const homeworkNode: DecisionNode = {
      id: 'homework',
      type: NodeType.DECISION,
      question: 'Homework',
      branches: [
        {
          condition: '<50',
          label: '< 50%',
          nextNode: homeworkLowNode
        },
        {
          condition: '>=50',
          label: '>= 50%',
          nextNode: parentInvNode
        }
      ]
    };

    // Right side - Attendance >= 70% branch
    const studyHoursLowNode: OutcomeNode = {
      id: 'outcome_4',
      type: NodeType.OUTCOME,
      result: PerformanceLevel.MEDIUM,
      icon: '👏'
    };

    const studyHoursHighNode: OutcomeNode = {
      id: 'outcome_5',
      type: NodeType.OUTCOME,
      result: PerformanceLevel.HIGH,
      icon: '⭐'
    };

    const studyHoursNode: DecisionNode = {
      id: 'study_hours',
      type: NodeType.DECISION,
      question: 'Study Hours',
      branches: [
        {
          condition: '<3',
          label: '< 3',
          nextNode: studyHoursLowNode
        },
        {
          condition: '>3',
          label: '> 3',
          nextNode: studyHoursHighNode
        }
      ]
    };

    const participationHighNode: OutcomeNode = {
      id: 'outcome_6',
      type: NodeType.OUTCOME,
      result: PerformanceLevel.MEDIUM,
      icon: '👏'
    };

    const participationNode: DecisionNode = {
      id: 'participation',
      type: NodeType.DECISION,
      question: 'Participation',
      branches: [
        {
          condition: 'low',
          label: 'Low',
          nextNode: studyHoursNode
        },
        {
          condition: 'high',
          label: 'High',
          nextNode: participationHighNode
        }
      ]
    };

    const quizScoreHighNode: OutcomeNode = {
      id: 'outcome_7',
      type: NodeType.OUTCOME,
      result: PerformanceLevel.HIGH,
      icon: '⭐'
    };

    const quizScoreNode: DecisionNode = {
      id: 'quiz_score',
      type: NodeType.DECISION,
      question: 'Quiz Score',
      branches: [
        {
          condition: '<=75',
          label: '<= 75',
          nextNode: participationNode
        },
        {
          condition: '>75',
          label: '> 75',
          nextNode: quizScoreHighNode
        }
      ]
    };

    // Root node
    const attendanceNode: DecisionNode = {
      id: 'attendance_rate',
      type: NodeType.DECISION,
      question: 'Attendance Rate',
      branches: [
        {
          condition: '<70',
          label: '< 70%',
          nextNode: homeworkNode
        },
        {
          condition: '>=70',
          label: '>= 70%',
          nextNode: quizScoreNode
        }
      ]
    };

    return attendanceNode;
  }

  // Get current node
  getCurrentNode(): TreeNode {
    return this.currentStep.node;
  }

  // Check if current node is a decision node
  isDecisionNode(): boolean {
    return this.currentStep.node.type === NodeType.DECISION;
  }

  // Check if current node is an outcome node
  isOutcomeNode(): boolean {
    return this.currentStep.node.type === NodeType.OUTCOME;
  }

  // Get available options for current decision node
  getOptions(): Branch[] | null {
    if (this.isDecisionNode()) {
      return (this.currentStep.node as DecisionNode).branches;
    }
    return null;
  }

  // Make a decision and move to next node
  makeDecision(branchIndex: number): boolean {
    if (!this.isDecisionNode()) {
      return false;
    }

    const decisionNode = this.currentStep.node as DecisionNode;
    const branch = decisionNode.branches[branchIndex];

    if (!branch) {
      return false;
    }

    // Record the answer
    this.currentStep.answers.set(decisionNode.question, branch.label);
    this.currentStep.path.push(`${decisionNode.question}: ${branch.label}`);

    // Move to next node
    this.currentStep.node = branch.nextNode;

    return true;
  }

  // Get the final result (if at outcome node)
  getResult(): PerformanceLevel | null {
    if (this.isOutcomeNode()) {
      return (this.currentStep.node as OutcomeNode).result;
    }
    return null;
  }

  // Get the current path taken
  getPath(): string[] {
    return [...this.currentStep.path];
  }

  // Get all answers
  getAnswers(): Map<string, string> {
    return new Map(this.currentStep.answers);
  }

  // Reset the tree to start over
  reset(): void {
    this.currentStep = {
      node: this.root,
      path: [],
      answers: new Map()
    };
  }

  // Get the entire tree structure (for visualization)
  getTree(): DecisionNode {
    return this.root;
  }

  // Execute with all answers at once (for testing)
  executeWithAnswers(answers: { [key: string]: number }): PerformanceLevel {
    this.reset();
    
    const keys = Object.keys(answers);
    for (const key of keys) {
      if (!this.isDecisionNode()) break;
      this.makeDecision(answers[key]);
    }

    return this.getResult() || PerformanceLevel.LOW;
  }
}

// Example usage:
/*
const tree = new StudentAnalyzerTree();

// Step 1: Check attendance
console.log(tree.getCurrentNode()); // Attendance Rate decision
console.log(tree.getOptions()); // Shows branches

// Make decision: Attendance < 70%
tree.makeDecision(0);

// Step 2: Check homework
console.log(tree.getCurrentNode()); // Homework decision
tree.makeDecision(1); // >= 50%

// Step 3: Check parent involvement
console.log(tree.getCurrentNode()); // Parent Involvement decision
tree.makeDecision(0); // High

// Get final result
console.log(tree.getResult()); // "Medium Performance"
console.log(tree.getPath()); // Shows the path taken
console.log(tree.getAnswers()); // Shows all answers

// Or execute all at once:
tree.reset();
const result = tree.executeWithAnswers({
  attendance_rate: 0,  // < 70%
  homework: 1,         // >= 50%
  parent_involvement: 0 // High
});
console.log(result); // "Medium Performance"
*/
